"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";

// Extend the Window interface to include ethereum
declare global {
	interface Window {
		ethereum?: any;
	}
}
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import {
	CONTRACT_ADDRESS,
	SPC_TOKEN_ADDRESS,
	STAKING_ABI,
	SPC_TOKEN_ABI,
	MONAD_CHAIN_ID,
	MONAD_RPC_URL,
} from "@/lib/contract";

interface Web3ContextType {
	isConnected: boolean;
	account: string | null;
	balance: string;
	isOnMonad: boolean;
	connect: () => Promise<void>;
	disconnect: () => void;
	stakeTokens: (amount: string, duration: string) => Promise<boolean>;
	unstakeTokens: (positionId: string) => Promise<boolean>;
	claimRewards: () => Promise<boolean>;
	getUserPositions: () => Promise<any[]>;
	getPendingRewards: () => Promise<string>;
	switchToMonad: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
	const [isConnected, setIsConnected] = useState(false);
	const [account, setAccount] = useState<string | null>(null);
	const [balance, setBalance] = useState("0");
	const [isOnMonad, setIsOnMonad] = useState(false);
	const { toast } = useToast();

	const checkNetwork = async () => {
		if (typeof window !== "undefined" && window.ethereum) {
			try {
				const chainId = await window.ethereum.request({ method: "eth_chainId" });
				const isCorrectNetwork = Number.parseInt(chainId, 16) === MONAD_CHAIN_ID;
				setIsOnMonad(isCorrectNetwork);
				return isCorrectNetwork;
			} catch (error) {
				console.error("Error checking network:", error);
				return false;
			}
		}
		return false;
	};

	const switchToMonad = async () => {
		if (typeof window !== "undefined" && window.ethereum) {
			try {
				await window.ethereum.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: `0x${MONAD_CHAIN_ID.toString(16)}` }],
				});
			} catch (switchError: any) {
				if (switchError.code === 4902) {
					try {
						await window.ethereum.request({
							method: "wallet_addEthereumChain",
							params: [
								{
									chainId: `0x${MONAD_CHAIN_ID.toString(16)}`,
									chainName: "Monad Testnet",
									nativeCurrency: {
										name: "MON",
										symbol: "MON",
										decimals: 18,
									},
									rpcUrls: [MONAD_RPC_URL],
									blockExplorerUrls: ["https://testnet-explorer.monad.xyz"],
								},
							],
						});
					} catch (addError) {
						console.error("Error adding Monad network:", addError);
						toast({
							title: "Network Error",
							description: "Failed to add Monad network",
							variant: "destructive",
						});
					}
				}
			}
		}
	};

	const connect = async () => {
		if (typeof window !== "undefined" && window.ethereum) {
			try {
				const accounts = await window.ethereum.request({
					method: "eth_requestAccounts",
				});

				if (accounts.length > 0) {
					setAccount(accounts[0]);
					setIsConnected(true);

					const networkCheck = await checkNetwork();
					if (!networkCheck) {
						toast({
							title: "Wrong Network",
							description: "Please switch to Monad network to continue",
							variant: "destructive",
						});
						await switchToMonad();
					}

					await updateBalance(accounts[0]);

					toast({
						title: "Wallet Connected",
						description: "Successfully connected to your wallet",
					});
				}
			} catch (error) {
				console.error("Error connecting wallet:", error);
				toast({
					title: "Connection Failed",
					description: "Failed to connect wallet",
					variant: "destructive",
				});
			}
		} else {
			toast({
				title: "No Wallet Found",
				description: "Please install MetaMask or another Web3 wallet",
				variant: "destructive",
			});
		}
	};

	const disconnect = () => {
		setIsConnected(false);
		setAccount(null);
		setBalance("0");
		setIsOnMonad(false);
		toast({
			title: "Wallet Disconnected",
			description: "Your wallet has been disconnected",
		});
	};

	const updateBalance = async (address: string) => {
		if (typeof window !== "undefined" && window.ethereum) {
			try {
				const provider = new ethers.BrowserProvider(window.ethereum);
				const contract = new ethers.Contract(
					SPC_TOKEN_ADDRESS,
					SPC_TOKEN_ABI,
					provider
				);
				const balance = await contract.balanceOf(address);
				setBalance(ethers.formatEther(balance));
			} catch (error) {
				console.error("Error fetching balance:", error);
			}
		}
	};

	const stakeTokens = async (
		amount: string,
		duration: string
	): Promise<boolean> => {
		if (!isConnected || !account) return false;

		try {
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();

			// First approve the staking contract
			const tokenContract = new ethers.Contract(
				SPC_TOKEN_ADDRESS,
				SPC_TOKEN_ABI,
				signer
			);
			const amountWei = ethers.parseEther(amount);

			const approveTx = await tokenContract.approve(CONTRACT_ADDRESS, amountWei);
			await approveTx.wait();

			// Then stake
			const stakingContract = new ethers.Contract(
				CONTRACT_ADDRESS,
				STAKING_ABI,
				signer
			);
			const stakeTx = await stakingContract.stake(amountWei, duration);
			await stakeTx.wait();

			await updateBalance(account);
			return true;
		} catch (error) {
			console.error("Error staking tokens:", error);
			return false;
		}
	};

	const unstakeTokens = async (positionId: string): Promise<boolean> => {
		if (!isConnected || !account) return false;

		try {
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();
			const contract = new ethers.Contract(CONTRACT_ADDRESS, STAKING_ABI, signer);

			const tx = await contract.unstake(positionId);
			await tx.wait();

			await updateBalance(account);
			return true;
		} catch (error) {
			console.error("Error unstaking tokens:", error);
			return false;
		}
	};

	const claimRewards = async (): Promise<boolean> => {
		if (!isConnected || !account) return false;

		try {
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();
			const contract = new ethers.Contract(CONTRACT_ADDRESS, STAKING_ABI, signer);

			const tx = await contract.claim();
			await tx.wait();

			await updateBalance(account);
			return true;
		} catch (error) {
			console.error("Error claiming rewards:", error);
			return false;
		}
	};

	const getUserPositions = async (): Promise<any[]> => {
		if (!isConnected || !account) return [];

		try {
			const provider = new ethers.BrowserProvider(window.ethereum);
			const contract = new ethers.Contract(
				CONTRACT_ADDRESS,
				STAKING_ABI,
				provider
			);

			// Get all position IDs for the user
			const positionIds: bigint[] = await contract.userPositions(account);

			const fetchedPositions = await Promise.all(
				positionIds.map(async (id: bigint) => {
					const pos = await contract.positions(id); // Fetch individual position details by ID
					const amountInTokens = ethers.formatEther(pos.amount);

					return {
						id: id.toString(), // Use the actual position ID
						amount: amountInTokens,
						unlockTime: Number(pos.unlockTime),
						multiplierBps: Number(pos.multiplierBps),
						duration: Number(pos.duration), // New field
						active: pos.active,
						plan: Number(pos.plan),
						rewards: "0.0000", // Rewards are fetched globally, not per position from contract
					};
				})
			);

			return fetchedPositions;
		} catch (error) {
			console.error("Error fetching positions:", error);
			return []; // Return empty array on error
		}
	};

	const getPendingRewards = async (): Promise<string> => {
		if (!isConnected || !account) return "0";

		try {
			const provider = new ethers.BrowserProvider(window.ethereum);
			const contract = new ethers.Contract(
				CONTRACT_ADDRESS,
				STAKING_ABI,
				provider
			);

			const rewards = await contract.pendingRewards(account);
			const formattedRewards = ethers.formatEther(rewards); // Convert from wei to tokens
			return Number(formattedRewards).toFixed(4);
		} catch (error) {
			console.error("Error fetching pending rewards:", error);
			return "0"; // Default to 0 on error
		}
	};

	useEffect(() => {
		if (typeof window !== "undefined" && window.ethereum) {
			// Check if already connected
			window.ethereum
				.request({ method: "eth_accounts" })
				.then((accounts: string[]) => {
					if (accounts.length > 0) {
						setAccount(accounts[0]);
						setIsConnected(true);
						checkNetwork();
						updateBalance(accounts[0]);
					}
				});

			// Listen for account changes
			window.ethereum.on("accountsChanged", (accounts: string[]) => {
				if (accounts.length > 0) {
					setAccount(accounts[0]);
					setIsConnected(true);
					updateBalance(accounts[0]);
				} else {
					disconnect();
				}
			});

			// Listen for network changes
			window.ethereum.on("chainChanged", () => {
				checkNetwork();
			});
		}
	}, []);

	const value: Web3ContextType = {
		isConnected,
		account,
		balance,
		isOnMonad,
		connect,
		disconnect,
		stakeTokens,
		unstakeTokens,
		claimRewards,
		getUserPositions,
		getPendingRewards,
		switchToMonad,
	};

	return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
	const context = useContext(Web3Context);
	if (context === undefined) {
		throw new Error("useWeb3 must be used within a Web3Provider");
	}
	return context;
}
