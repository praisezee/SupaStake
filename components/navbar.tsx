"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Menu, X } from "lucide-react";

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	const navigation = [
		{ name: "Home", href: "/" },
		{ name: "Stake", href: "/stake" },
		{ name: "Dashboard", href: "/dashboard" },
	];

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center space-x-2">
						<Logo variant="logo" />
						<span className="text-xl font-bold text-gradient-purple-lime">
							SupaStake
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className={`relative px-3 py-2 text-sm font-medium transition-colors ${
									pathname === item.href
										? "text-lime-400"
										: "text-gray-300 hover:text-white"
								}`}>
								{item.name}
								{pathname === item.href && (
									<motion.div
										className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-lime-500"
										layoutId="navbar-indicator"
									/>
								)}
							</Link>
						))}
					</div>

					{/* Connect Button */}
					<div className="hidden md:block">
						<ConnectButton showBalance={false} />
					</div>

					{/* Mobile menu button */}
					<Button
						variant="ghost"
						size="sm"
						className="md:hidden"
						onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					</Button>
				</div>

				{/* Mobile Navigation */}
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="md:hidden py-4 border-t border-white/10">
						<div className="flex flex-col space-y-4">
							{navigation.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className={`px-3 py-2 text-sm font-medium transition-colors ${
										pathname === item.href
											? "text-lime-400"
											: "text-gray-300 hover:text-white"
									}`}
									onClick={() => setIsOpen(false)}>
									{item.name}
								</Link>
							))}
							<div className="px-3 py-2">
								<ConnectButton />
							</div>
						</div>
					</motion.div>
				)}
			</div>
		</nav>
	);
}
