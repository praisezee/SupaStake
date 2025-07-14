import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Web3Provider } from "@/components/web3-provider";
import { InstallPrompt } from "@/components/install-prompt";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "SupaStake: SupaDao official staking platform",
	description:
		"A Progressive Web App for staking SupaCoin Token a native for SupaDao.",
	manifest: "/manifest.json",
	icons: {
		icon: "/supadao-logo.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange>
					<Web3Provider>{children}</Web3Provider>
					<Toaster />
					<InstallPrompt />
				</ThemeProvider>
			</body>
		</html>
	);
}
