"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/navbar";
import { FloatingElements } from "@/components/floating-elements";
import { BackgroundGrid } from "@/components/background-grid";
import { useWeb3 } from "@/components/web3-provider";
import { useToast } from "@/hooks/use-toast";
import { STAKING_PLANS, type StakingPlanId } from "@/lib/contract";
import {
	Coins,
	Lock,
	Percent,
	Zap,
	CheckCircle,
	Wallet,
	Sparkles,
} from "lucide-react";

export default function StakePage() {
	const { isConnected, account, balance, stakeTokens, connect } = useWeb3();
	const { toast } = useToast();
	const [amount, setAmount] = useState("");
	const [selectedPlan, setSelectedPlan] = useState<StakingPlanId>("0");
	const [isStaking, setIsStaking] = useState(false);

	const handleStake = async () => {
		if (!isConnected || !account) {
			toast({
				title: "Wallet Not Connected",
				description: "Please connect your wallet to stake tokens.",
				variant: "destructive",
			});
			return;
		}

		const stakeAmount = Number.parseFloat(amount);
		if (isNaN(stakeAmount) || stakeAmount <= 0) {
			toast({
				title: "Invalid Amount",
				description: "Please enter a valid staking amount.",
				variant: "destructive",
			});
			return;
		}

		if (stakeAmount > Number.parseFloat(balance)) {
			toast({
				title: "Insufficient Balance",
				description: "You do not have enough SPC tokens to stake this amount.",
				variant: "destructive",
			});
			return;
		}

		setIsStaking(true);
		try {
			const plan =
				selectedPlan === "0"
					? "0"
					: (parseInt(selectedPlan) * 60 * 60 * 24).toString();
			const success = await stakeTokens(amount, plan);
			if (success) {
				toast({
					title: "Staking Successful!",
					description: `Successfully staked ${amount} SPC for ${STAKING_PLANS[selectedPlan].duration}.`,
				});
				setAmount("");
			} else {
				toast({
					title: "Staking Failed",
					description: "There was an error staking your tokens. Please try again.",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Staking error:", error);
			toast({
				title: "Staking Error",
				description: "An unexpected error occurred during staking.",
				variant: "destructive",
			});
		} finally {
			setIsStaking(false);
		}
	};

	const currentPlan = STAKING_PLANS[selectedPlan];

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
									Connect to Start Staking
								</span>
							</div>

							<h1 className="text-4xl md:text-5xl font-bold mb-6">
								Unlock Your{" "}
								<span className="text-gradient-purple-lime">Earning Potential</span>
							</h1>

							<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
								Connect your wallet to explore staking plans and start earning rewards
								on your SPC tokens.
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
				<div className="container mx-auto max-w-4xl">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="mb-12 text-center">
						<h1 className="text-4xl md:text-5xl font-bold mb-4">
							Stake <span className="text-gradient-purple-lime">SPC</span>
						</h1>
						<p className="text-xl text-muted-foreground">
							Choose your staking plan and start earning rewards.
						</p>
					</motion.div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Staking Form */}
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}>
							<Card className="glass-effect border-purple-500/30">
								<CardHeader>
									<CardTitle className="text-gradient-purple-lime">New Stake</CardTitle>
									<CardDescription className="text-muted-foreground">
										Enter the amount you want to stake and select a plan.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div>
										<Label
											htmlFor="amount"
											className="text-muted-foreground">
											Amount to Stake (SPC)
										</Label>
										<Input
											id="amount"
											type="number"
											placeholder="0.00"
											value={amount}
											onChange={(e) => setAmount(e.target.value)}
											className="mt-2 bg-transparent border-purple-500/30 focus:ring-purple-500/50"
										/>
										<p className="text-sm text-muted-foreground mt-2">
											Available Balance: {Number.parseFloat(balance).toFixed(2)} SPC
										</p>
									</div>

									<div>
										<Label className="text-muted-foreground">Staking Plan</Label>
										<Tabs
											defaultValue={selectedPlan}
											onValueChange={(value) => setSelectedPlan(value as StakingPlanId)}
											className="mt-2">
											<TabsList className="grid w-full grid-cols-2 md:grid-cols-4 glass-effect gap-2 border border-purple-500/30  h-fit">
												{Object.values(STAKING_PLANS).map((plan) => (
													<TabsTrigger
														key={plan.id}
														value={plan.id}
														className="data-[state=active]:bg-purple-500/20">
														{plan.name}
													</TabsTrigger>
												))}
											</TabsList>
											{Object.values(STAKING_PLANS).map((plan) => (
												<TabsContent
													key={plan.id}
													value={plan.id}
													className="mt-4">
													<Card className="glass-effect border-lime-500/30">
														<CardContent className="p-4 space-y-2">
															<div className="flex items-center justify-between">
																<span className="text-muted-foreground">APY:</span>
																<span className="font-semibold text-lime-400 flex items-center">
																	<Percent className="w-4 h-4 mr-1" />
																	{plan.apy}%
																</span>
															</div>
															<div className="flex items-center justify-between">
																<span className="text-muted-foreground">Duration:</span>
																<span className="font-semibold text-purple-300 flex items-center">
																	<Lock className="w-4 h-4 mr-1" />
																	{plan.duration}
																</span>
															</div>
															<div className="flex items-center justify-between">
																<span className="text-muted-foreground">Unstaking Fee:</span>
																<span className="font-semibold text-red-400 flex items-center">
																	<Coins className="w-4 h-4 mr-1" />
																	{plan.fee}%
																</span>
															</div>
															<ul className="text-sm text-muted-foreground space-y-1 mt-3">
																{plan.features.map((feature, i) => (
																	<li
																		key={i}
																		className="flex items-center">
																		<CheckCircle className="w-4 h-4 mr-2 text-lime-400" />
																		{feature}
																	</li>
																))}
															</ul>
														</CardContent>
													</Card>
												</TabsContent>
											))}
										</Tabs>
									</div>

									<Button
										onClick={handleStake}
										disabled={
											isStaking ||
											Number.parseFloat(amount) <= 0 ||
											Number.parseFloat(amount) > Number.parseFloat(balance)
										}
										className="w-full gradient-purple-lime text-black font-semibold text-lg py-3 glow-purple">
										{isStaking ? "Staking..." : "Stake Now"}
										<Zap className="w-5 h-5 ml-2" />
									</Button>
								</CardContent>
							</Card>
						</motion.div>

						{/* Staking Summary */}
						<motion.div
							initial={{ opacity: 0, x: 30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}>
							<Card className="glass-effect border-lime-500/30 h-full">
								<CardHeader>
									<CardTitle className="text-gradient-purple-lime">
										Staking Summary
									</CardTitle>
									<CardDescription className="text-muted-foreground">
										Overview of your selected staking options.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">Staking Amount:</span>
										<span className="font-semibold text-foreground">
											{Number.parseFloat(amount) > 0
												? Number.parseFloat(amount).toFixed(2)
												: "0.00"}{" "}
											SPC
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">Selected Plan:</span>
										<span className="font-semibold text-foreground">
											{currentPlan.name}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">
											Annual Percentage Yield (APY):
										</span>
										<span className="font-semibold text-lime-400">
											{currentPlan.apy}%
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">Lock Duration:</span>
										<span className="font-semibold text-purple-300">
											{currentPlan.duration}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">Unstaking Fee:</span>
										<span className="font-semibold text-red-400">{currentPlan.fee}%</span>
									</div>
									<div className="flex items-center justify-between text-lg font-bold pt-4 border-t border-purple-500/20">
										<span className="text-gradient-purple-lime">Estimated Return:</span>
										<span className="text-gradient-purple-lime">
											{Number.parseFloat(amount) > 0
												? (Number.parseFloat(amount) * (currentPlan.apy / 100)).toFixed(2)
												: "0.00"}{" "}
											SPC/Year
										</span>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}
