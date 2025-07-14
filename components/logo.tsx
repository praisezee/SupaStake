"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface LogoProps {
	size?: "sm" | "md" | "lg";
	showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
	const sizeClasses = {
		sm: "w-6 h-6",
		md: "w-8 h-8",
		lg: "w-12 h-12",
	};

	const textSizeClasses = {
		sm: "text-lg",
		md: "text-xl",
		lg: "text-3xl",
	};

	return (
		<div className="flex items-center space-x-2">
			<motion.div
				className={`${sizeClasses[size]} relative overflow-hidden rounded-xl flex items-center justify-center`}
				whileHover={{ scale: 1.05, rotate: 5 }}
				transition={{ type: "spring", stiffness: 400, damping: 17 }}>
				<Image
					src="/supadao-logo.png"
					alt="SupaDao"
					width={size === "sm" ? 24 : size === "md" ? 32 : 48}
					height={size === "sm" ? 24 : size === "md" ? 32 : 48}
					className="w-full h-full object-contain"
				/>

				{/* Animated shine effect */}
				<motion.div
					className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
					initial={{ x: "-100%" }}
					animate={{ x: "100%" }}
					transition={{
						duration: 2,
						repeat: Number.POSITIVE_INFINITY,
						repeatDelay: 4,
						ease: "easeInOut",
					}}
				/>

				{/* Pulsing glow */}
				<motion.div
					className="absolute inset-0 rounded-xl"
					style={{
						background: "linear-gradient(135deg, #aa6ce8 0%, #cbfc00 100%)",
						filter: "blur(8px)",
						opacity: 0.3,
					}}
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.3, 0.6, 0.3],
					}}
					transition={{
						duration: 3,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
				/>
			</motion.div>

			{showText && (
				<motion.span
					className={`${textSizeClasses[size]} font-bold text-gradient-purple-lime hidden md:inline`}
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}>
					SupaDao
				</motion.span>
			)}

			{/* Show text on small screens */}
			{showText && (
				<motion.span
					className="text-sm font-bold text-gradient-purple-lime md:hidden"
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}>
					SupaDao
				</motion.span>
			)}
		</div>
	);
}
