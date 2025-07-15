import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

// Define Monad testnet
const monadTestnet = defineChain({
	id: 10143,
	name: "Monad Testnet",
	nativeCurrency: {
		decimals: 18,
		name: "MON",
		symbol: "MON",
	},
	rpcUrls: {
		default: {
			http: ["https://testnet-rpc.monad.xyz"],
		},
	},
	blockExplorers: {
		default: {
			name: "Monad Explorer",
			url: "https://testnet-explorer.monad.xyz",
		},
	},
	testnet: true,
});

export const config = getDefaultConfig({
	appName: "SupaStake",
	projectId:
		process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
		"1d133a68-fe75-4c14-8064-d3255568fcee",
	chains: [monadTestnet],
	ssr: true,
});
