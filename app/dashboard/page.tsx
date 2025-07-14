"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/navbar";
import { FloatingElements } from "@/components/floating-elements";
import { BackgroundGrid } from "@/components/background-grid";
import { useWeb3 } from "@/components/web3-provider";
import { useToast } from "@/hooks/use-toast";
import { STAKING_PLANS } from "@/lib/contract";
import {
	Coins,
	TrendingUp,
	Gift,
	Wallet,
	BarChart3,
	ArrowUpRight,
	ArrowDownRight,
	Sparkles,
	Target,
} from "lucide-react";

interface Position {
	id: string;
	amount: string;
	unlockTime: number;
	multiplierBps: number;
	duration: number;
	active: boolean;
	plan: number;
	rewards?: string; // This will now be a placeholder or removed if not directly from contract per position
}

export default function DashboardPage() {
	const {
		isConnected,
		account,
		balance,
		getUserPositions,
		getPendingRewards,
		claimRewards,
		unstakeTokens,
		connect,
	} = useWeb3();
	const { toast } = useToast();
	const [positions, setPositions] = useState<Position[]>([]);
	const [pendingRewards, setPendingRewards] = useState("0");
	const [isLoading, setIsLoading] = useState(false);
	const [isClaiming, setIsClaiming] = useState(false);

	const loadData = async () => {
		if (!isConnected || !account) return;

		setIsLoading(true);
		try {
			const [userPositions, rewards] = await Promise.all([
				getUserPositions(),
				getPendingRewards(),
			]);

			setPositions(userPositions);
			setPendingRewards(rewards);
		} catch (error) {
			console.error("Error loading data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClaim = async () => {
		setIsClaiming(true);
		try {
			const success = await claimRewards();
			if (success) {
				toast({
					title: "Rewards Claimed!",
					description: `Successfully claimed ${pendingRewards} SPC tokens`,
				});
				await loadData();
			}
		} catch (error) {
			toast({
				title: "Claim Failed",
				description: "Failed to claim rewards. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsClaiming(false);
		}
	};

	const handleUnstake = async (positionId: string) => {
		try {
			const success = await unstakeTokens(positionId);
			if (success) {
				toast({
					title: "Unstaking Successful!",
					description: "Your tokens have been unstaked",
				});
				await loadData();
			}
		} catch (error) {
			toast({
				title: "Unstaking Failed",
				description: "Failed to unstake tokens. Please try again.",
				variant: "destructive",
			});
		}
	};

	useEffect(() => {
		if (isConnected) {
			loadData();
		}
	}, [isConnected, account]);

	const totalStaked = positions.reduce(
		(sum, pos) => sum + Number.parseFloat(pos.amount || "0"),
		0
	);
	const activePositions = positions.filter((pos) => pos.active);

	if (!isConnected) {
		return (
			<div className="min-h-screen bg-background relative overflow-hidden">
				<BackgroundGrid />
				<FloatingElements />
				<Navbar />

				<div className="relative z-10 pt-32 pb-20 px-4">
					<div className="container mx-auto max-w-4xl text-center">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}>
							<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-purple-500/30 mb-6">
								<Sparkles className="w-4 h-4 text-lime-400" />
								<span className="text-sm text-purple-300">
									Connect to View Dashboard
								</span>
							</div>

							<h1 className="text-4xl md:text-5xl font-bold mb-6">
								Your{" "}
								<span className="text-gradient-purple-lime">Staking Dashboard</span>
							</h1>

							<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
								Connect your wallet to view your staking positions, rewards, and
								portfolio performance.
							</p>

							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}>
								<Button
									onClick={connect}
									size="lg"
									className="gradient-purple-lime text-black font-semibold text-lg px-8 py-4 glow-purple">
									<Wallet className="w-5 h-5 mr-2" />
									Connect Wallet
								</Button>
							</motion.div>
						</motion.div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background relative overflow-hidden">
			<BackgroundGrid />
			<FloatingElements />
			<Navbar />

			<div className="relative z-10 pt-32 pb-20 px-4">
				<div className="container mx-auto max-w-7xl">
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="mb-12">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<div>
								<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-purple-500/30 mb-4">
									<Sparkles className="w-4 h-4 text-lime-400" />
									<span className="text-sm text-purple-300">
										Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
									</span>
								</div>
								<h1 className="text-4xl md:text-5xl font-bold mb-2">
									Staking <span className="text-gradient-purple-lime">Dashboard</span>
								</h1>
								<p className="text-xl text-muted-foreground">
									Monitor your staking positions and rewards
								</p>
							</div>

							<div className="flex gap-3">
								<Button
									onClick={handleClaim}
									disabled={isClaiming || Number.parseFloat(pendingRewards) <= 0}
									className={`font-semibold ${
										Number.parseFloat(pendingRewards) > 0
											? "gradient-purple-lime text-black glow-purple"
											: "glass-effect border-purple-500/50 text-purple-300 bg-transparent"
									}`}>
									{isClaiming
										? "Claiming..."
										: `Claim ${Number.parseFloat(pendingRewards).toFixed(2)} SPC`}
									<Gift className="w-4 h-4 ml-2" />
								</Button>
							</div>
						</div>
					</motion.div>

					{/* Stats Overview */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
						<Card className="glass-effect border-purple-500/30">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-muted-foreground">Total Staked</p>
										<p className="text-2xl font-bold text-gradient-purple-lime">
											{totalStaked.toFixed(2)} SPC
										</p>
									</div>
									<Coins className="w-8 h-8 text-purple-400" />
								</div>
							</CardContent>
						</Card>

						<Card className="glass-effect border-lime-500/30">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-muted-foreground">Pending Rewards</p>
										<p className="text-2xl font-bold text-gradient-purple-lime">
											{Number.parseFloat(pendingRewards).toFixed(4)} SPC
										</p>
									</div>
									<Gift className="w-8 h-8 text-lime-400" />
								</div>
							</CardContent>
						</Card>

						<Card className="glass-effect border-purple-500/30">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-muted-foreground">Active Positions</p>
										<p className="text-2xl font-bold text-gradient-purple-lime">
											{activePositions.length}
										</p>
									</div>
									<Target className="w-8 h-8 text-purple-400" />
								</div>
							</CardContent>
						</Card>

						<Card className="glass-effect border-lime-500/30">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-muted-foreground">Wallet Balance</p>
										<p className="text-2xl font-bold text-gradient-purple-lime">
											{Number.parseFloat(balance).toFixed(2)} SPC
										</p>
									</div>
									<Wallet className="w-8 h-8 text-lime-400" />
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Main Content */}
					<Tabs
						defaultValue="positions"
						className="space-y-6">
						<TabsList className="glass-effect border border-purple-500/30">
							<TabsTrigger
								value="positions"
								className="data-[state=active]:bg-purple-500/20">
								<span className="hidden mg:block">Staking Positions</span>
								<span className="md:hidden">Positions</span>
							</TabsTrigger>
							<TabsTrigger
								value="rewards"
								className="data-[state=active]:bg-purple-500/20">
								<span className="hidden mg:block">Rewards History</span>
								<span className="md:hidden">History</span>
							</TabsTrigger>
							<TabsTrigger
								value="analytics"
								className="data-[state=active]:bg-purple-500/20">
								Analytics
							</TabsTrigger>
						</TabsList>

						<TabsContent
							value="positions"
							className="space-y-6">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6 }}>
								<Card className="glass-effect border-purple-500/30">
									<CardHeader>
										<CardTitle className="text-gradient-purple-lime">
											Your Staking Positions
										</CardTitle>
									</CardHeader>
									<CardContent>
										{isLoading ? (
											<div className="text-center py-12">
												<div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
												<p className="text-muted-foreground">Loading your positions...</p>
											</div>
										) : positions.length === 0 ? (
											<div className="text-center py-12">
												<Coins className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
												<h3 className="text-xl font-semibold mb-2 text-gradient-purple-lime">
													No Staking Positions
												</h3>
												<p className="text-muted-foreground mb-6">
													You haven't staked any SPC tokens yet
												</p>
												<Button
													asChild
													className="gradient-purple-lime text-black font-semibold">
													<a href="/stake">
														Start Staking
														<ArrowUpRight className="w-4 h-4 ml-2" />
													</a>
												</Button>
											</div>
										) : (
											<div className="space-y-4">
												{positions.map((position, index) => {
													const acuratePlan =
														parseFloat(position.duration.toString()) / (60 * 60 * 24);
													const plan =
														Object.values(STAKING_PLANS).find(
															(p) => p.id === acuratePlan.toString()
														) || STAKING_PLANS["0"];
													const isUnlocked = position.unlockTime * 1000 < Date.now();

													// Format dates properly
													const getDisplayDate = () => {
														if (plan.id === "0") {
															// Dynamic plan - show current date
															return new Date().toLocaleDateString("en-US", {
																year: "numeric",
																month: "short",
																day: "numeric",
															});
														} else {
															// Fixed plan - show unlock date
															return new Date(position.unlockTime * 1000).toLocaleDateString(
																"en-US",
																{
																	year: "numeric",
																	month: "short",
																	day: "numeric",
																}
															);
														}
													};

													const getDateLabel = () => {
														return plan.id === "0" ? "Staked Date" : "Unlock Date";
													};

													return (
														<motion.div
															key={position.id}
															initial={{ opacity: 0, y: 20 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ duration: 0.4, delay: index * 0.1 }}>
															<Card className="glass-effect border-lime-500/30 hover:glow-lime transition-all duration-300">
																<CardContent className="p-6">
																	<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
																		<div className="flex-1">
																			<div className="flex items-center gap-3 mb-3">
																				<Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
																					{plan.name}
																				</Badge>
																				<Badge
																					className={`${
																						position.active
																							? "bg-lime-500/20 text-lime-400 border-lime-500/30"
																							: "bg-red-500/20 text-red-400 border-red-500/30"
																					}`}>
																					{position.active ? "Active" : "Inactive"}
																				</Badge>
																				{isUnlocked && plan.id !== "0" && (
																					<Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
																						Unlocked
																					</Badge>
																				)}
																			</div>

																			<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
																				<div>
																					<p className="text-sm text-muted-foreground">Amount</p>
																					<p className="font-semibold text-gradient-purple-lime">
																						{Number.parseFloat(position.amount).toFixed(2)} SPC
																					</p>
																				</div>
																				<div>
																					<p className="text-sm text-muted-foreground">APY</p>
																					<p className="font-semibold text-lime-400">{plan.apy}%</p>
																				</div>
																				<div>
																					<p className="text-sm text-muted-foreground">
																						{getDateLabel()}
																					</p>
																					<p className="font-semibold text-purple-300">
																						{getDisplayDate()}
																					</p>
																				</div>
																				<div>
																					<p className="text-sm text-muted-foreground">Multiplier</p>
																					<p className="font-semibold text-lime-400">
																						{(position.multiplierBps / 10000).toFixed(1)}x
																					</p>
																				</div>
																				<div>
																					<p className="text-sm text-muted-foreground">Rewards</p>
																					<p className="font-semibold text-gradient-purple-lime">
																						{/* Display total pending rewards here, as per-position rewards are not directly from contract */}
																						{pendingRewards} SPC
																					</p>
																				</div>
																			</div>
																		</div>

																		<div className="flex gap-2">
																			{/* Unstake button is disabled if position is not active */}
																			<Button
																				onClick={() => handleUnstake(position.id)}
																				variant="outline"
																				className="glass-effect border-red-500/50 text-red-300 hover:bg-red-500/10"
																				disabled={!position.active}>
																				<ArrowDownRight className="w-4 h-4 mr-2" />
																				Unstake
																			</Button>
																		</div>
																	</div>
																</CardContent>
															</Card>
														</motion.div>
													);
												})}
											</div>
										)}
									</CardContent>
								</Card>
							</motion.div>
						</TabsContent>

						<TabsContent
							value="rewards"
							className="space-y-6">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6 }}>
								<Card className="glass-effect border-purple-500/30">
									<CardHeader>
										<CardTitle className="text-gradient-purple-lime">
											Rewards History
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="text-center py-12">
											<BarChart3 className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
											<h3 className="text-xl font-semibold mb-2 text-gradient-purple-lime">
												Coming Soon
											</h3>
											<p className="text-muted-foreground">
												Detailed rewards history and analytics will be available soon
											</p>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						</TabsContent>

						<TabsContent
							value="analytics"
							className="space-y-6">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6 }}>
								<div className="grid md:grid-cols-2 gap-6">
									<Card className="glass-effect border-purple-500/30">
										<CardHeader>
											<CardTitle className="text-gradient-purple-lime">
												Portfolio Performance
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-center py-8">
												<TrendingUp className="w-12 h-12 mx-auto mb-4 text-purple-400 opacity-50" />
												<p className="text-muted-foreground">
													Performance charts coming soon
												</p>
											</div>
										</CardContent>
									</Card>

									<Card className="glass-effect border-lime-500/30">
										<CardHeader>
											<CardTitle className="text-gradient-purple-lime">
												Staking Statistics
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-4">
												<div className="flex justify-between">
													<span className="text-muted-foreground">Total Positions</span>
													<span className="font-semibold text-purple-300">
														{positions.length}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-muted-foreground">Active Positions</span>
													<span className="font-semibold text-lime-400">
														{activePositions.length}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-muted-foreground">Average APY</span>
													<span className="font-semibold text-purple-300">
														{positions.length > 0
															? (
																	positions.reduce((sum, pos) => {
																		const plan =
																			Object.values(STAKING_PLANS).find(
																				(p) => p.id === pos.plan.toString()
																			) || STAKING_PLANS["0"];
																		return sum + plan.apy;
																	}, 0) / positions.length
															  ).toFixed(1)
															: "0"}
														%
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-muted-foreground">Total Rewards</span>
													<span className="font-semibold text-lime-400">
														{pendingRewards} SPC
													</span>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>
							</motion.div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
