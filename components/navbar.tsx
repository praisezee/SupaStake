"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useWeb3 } from "@/components/web3-provider";
import { Menu, X, Wallet } from "lucide-react";

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();
	const { isConnected, account, connect, disconnect } = useWeb3();

	const navigation = [
		{ name: "Home", href: "/" },
		{ name: "Stake", href: "/stake" },
		{ name: "Dashboard", href: "/dashboard" },
	];

	return (
		<motion.nav
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.8 }}
			className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-purple-500/20">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center">
						<Logo
							size="md"
							showText={true}
						/>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className={`relative px-3 py-2 text-sm font-medium transition-colors ${
									pathname === item.href
										? "text-transparent bg-gradient-to-r from-purple-400 to-lime-400 bg-clip-text"
										: "text-muted-foreground hover:text-purple-300"
								}`}>
								{item.name}
								{pathname === item.href && (
									<motion.div
										layoutId="navbar-indicator"
										className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-lime-400"
										transition={{ type: "spring", stiffness: 400, damping: 30 }}
									/>
								)}
							</Link>
						))}
					</div>

					{/* Wallet Connection */}
					<div className="hidden md:flex items-center space-x-4">
						{isConnected ? (
							<div className="flex items-center space-x-2">
								<div className="px-3 py-1 rounded-full glass-effect border border-purple-500/30 text-sm">
									{account?.slice(0, 6)}...{account?.slice(-4)}
								</div>
								<Button
									onClick={disconnect}
									variant="outline"
									size="sm"
									className="glass-effect border-purple-500/50 text-purple-300 hover:bg-purple-500/10 bg-transparent">
									Disconnect
								</Button>
							</div>
						) : (
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}>
								<Button
									onClick={connect}
									className="gradient-purple-lime text-black font-semibold glow-purple">
									<Wallet className="w-4 h-4 mr-2" />
									Connect Wallet
								</Button>
							</motion.div>
						)}
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsOpen(!isOpen)}
							className="text-purple-300 hover:bg-purple-500/10">
							{isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
						</Button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="md:hidden border-t border-purple-500/20">
						<div className="px-2 pt-2 pb-3 space-y-1">
							{navigation.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
										pathname === item.href
											? "text-transparent bg-gradient-to-r from-purple-400 to-lime-400 bg-clip-text bg-purple-500/10"
											: "text-muted-foreground hover:text-purple-300 hover:bg-purple-500/10"
									}`}
									onClick={() => setIsOpen(false)}>
									{item.name}
								</Link>
							))}
							<div className="pt-4 border-t border-purple-500/20">
								{isConnected ? (
									<div className="space-y-2">
										<div className="px-3 py-2 text-sm text-purple-300">
											{account?.slice(0, 6)}...{account?.slice(-4)}
										</div>
										<Button
											onClick={disconnect}
											variant="outline"
											size="sm"
											className="w-full glass-effect border-purple-500/50 text-purple-300 hover:bg-purple-500/10 bg-transparent">
											Disconnect
										</Button>
									</div>
								) : (
									<Button
										onClick={connect}
										className="w-full gradient-purple-lime text-black font-semibold">
										<Wallet className="w-4 h-4 mr-2" />
										Connect Wallet
									</Button>
								)}
							</div>
						</div>
					</motion.div>
				)}
			</div>
		</motion.nav>
	);
}
