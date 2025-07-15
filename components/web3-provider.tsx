"use client";

import {
	useAccount,
	useReadContract,
	useWriteContract,
	useWaitForTransactionReceipt,
} from "wagmi";
import { useToast } from "@/hooks/use-toast";
import {
	CONTRACT_ADDRESS,
	SPC_TOKEN_ADDRESS,
	STAKING_ABI,
	SPC_TOKEN_ABI,
} from "@/lib/contract";
import { parseEther, formatEther } from "viem";

export function useWeb3() {
	const { address, isConnected } = useAccount();
	const { toast } = useToast();
	const { writeContractAsync, data: hash, isPending } = useWriteContract();
	const { isLoading: isConfirming } = useWaitForTransactionReceipt({
		hash,
	});

	// Get SPC token balance
	const { data: balance } = useReadContract({
		address: SPC_TOKEN_ADDRESS,
		abi: SPC_TOKEN_ABI,
		functionName: "balanceOf",
		args: address ? [address] : undefined,
		query: {
			enabled: !!address,
		},
	});

	// Get user positions
	const { data: userPositionIds, refetch: refetchPositionIds } = useReadContract(
		{
			address: CONTRACT_ADDRESS,
			abi: STAKING_ABI,
			functionName: "userPositions",
			args: address ? [address] : undefined,
			query: {
				enabled: !!address,
			},
		}
	);

	const { data: positions, refetch: refetchPositions } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: STAKING_ABI,
		functionName: "getPosition",
		args: address ? [address] : undefined,
		query: {
			enabled: !!address,
		},
	});

	// Get pending rewards
	const { data: pendingRewards, refetch: refetchRewards } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: STAKING_ABI,
		functionName: "pendingRewards",
		args: address ? [address] : undefined,
		query: {
			enabled: !!address,
		},
	});

	const stakeTokens = async (
		amount: string,
		duration: string
	): Promise<boolean> => {
		if (!isConnected || !address) {
			toast({
				title: "Wallet Not Connected",
				description: "Please connect your wallet to stake tokens.",
				variant: "destructive",
			});
			return false;
		}

		try {
			const amountWei = parseEther(amount);
			const durationSeconds = BigInt(Number(duration) * 24 * 60 * 60); // Convert days to seconds

			// First approve the staking contract
			const hash = await writeContractAsync({
				address: SPC_TOKEN_ADDRESS,
				abi: SPC_TOKEN_ABI,
				functionName: "approve",
				args: [CONTRACT_ADDRESS, amountWei],
			});

			// Wait for approval confirmation
			if (hash) {
				// Then stake
				await writeContractAsync({
					address: CONTRACT_ADDRESS,
					abi: STAKING_ABI,
					functionName: "stake",
					args: [amountWei, durationSeconds],
				});

				toast({
					title: "Staking Successful!",
					description: `Successfully staked ${amount} SPC tokens.`,
				});
			} else {
				toast({
					title: "Staking Failed",
					description: "An error occurred while staking.",
					variant: "destructive",
				});
			}

			// Refetch data
			refetchPositionIds();
			refetchPositions();
			refetchRewards();

			return true;
		} catch (error: any) {
			console.error("Staking error:", error);
			toast({
				title: "Staking Failed",
				description: error.message || "An error occurred while staking.",
				variant: "destructive",
			});
			return false;
		}
	};

	const unstakeTokens = async (positionId: string): Promise<boolean> => {
		if (!isConnected || !address) return false;

		try {
			await writeContractAsync({
				address: CONTRACT_ADDRESS,
				abi: STAKING_ABI,
				functionName: "unstake",
				args: [BigInt(positionId)],
			});

			toast({
				title: "Unstaking Successful!",
				description: "Your tokens have been unstaked.",
			});

			// Refetch data
			refetchPositionIds();
			refetchPositions();
			refetchRewards();

			return true;
		} catch (error: any) {
			console.error("Unstaking error:", error);
			toast({
				title: "Unstaking Failed",
				description: error.message || "An error occurred while unstaking.",
				variant: "destructive",
			});
			return false;
		}
	};

	const claimRewards = async (): Promise<boolean> => {
		if (!isConnected || !address) return false;

		try {
			await writeContractAsync({
				address: CONTRACT_ADDRESS,
				abi: STAKING_ABI,
				functionName: "claim",
				args: [],
			});

			toast({
				title: "Rewards Claimed!",
				description: "Your rewards have been claimed successfully.",
			});

			// Refetch data
			refetchPositionIds();
			refetchPositions();
			refetchRewards();

			return true;
		} catch (error: any) {
			console.error("Claim error:", error);
			toast({
				title: "Claim Failed",
				description: error.message || "An error occurred while claiming rewards.",
				variant: "destructive",
			});
			return false;
		}
	};

	const getUserPositions = async () => {
		if (!isConnected || !address) return [];

		try {
			const { data: positions } = useReadContract({
				address: CONTRACT_ADDRESS,
				abi: STAKING_ABI,
				functionName: "getPosition",
				args: address ? [address] : undefined,
				query: {
					enabled: !!address,
				},
			});

			return positions;
		} catch (error) {
			console.error("Error fetching positions:", error);
			return [];
		}
	};

	return {
		isConnected,
		account: address,
		balance: balance ? formatEther(balance as bigint) : "0",
		stakeTokens,
		unstakeTokens,
		claimRewards,
		getUserPositions,
		getPendingRewards: () =>
			pendingRewards ? formatEther(pendingRewards as bigint) : "0",
		isLoading: isPending || isConfirming,
		userPositionIds: (userPositionIds as bigint[]) || [],
		pendingRewards: pendingRewards ? formatEther(pendingRewards as bigint) : "0",
		positions,
		refetchPositionIds,
		refetchPositions,
		refetchRewards,
	};
}
