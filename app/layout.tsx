import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { InstallPrompt } from "@/components/install-prompt";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "SupaStake: SupaDao official staking platform",
	description:
		"A Progressive Web App for staking SupaCoin Token a native for SupaDao.",
	manifest: "/manifest.json",
	icons: {
		icon: "/supadao-logo.png",
	},
	generator: "v0.dev",
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
					<Providers>
						{children}
						<Toaster />
						<InstallPrompt />
					</Providers>
				</ThemeProvider>
			</body>
		</html>
	);
}
