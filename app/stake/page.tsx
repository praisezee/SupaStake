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
import { useToast } from "@/hooks/use-toast";
import { STAKING_PLANS, type StakingPlanId } from "@/lib/contract";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useWeb3 } from "@/components/web3-provider";
import { Coins, Lock, Percent, Zap, CheckCircle, Wallet } from "lucide-react";

export default function StakePage() {
	const { isConnected } = useAccount();
	const { balance, stakeTokens, isLoading } = useWeb3();
	const { toast } = useToast();
	const [amount, setAmount] = useState("");
	const [selectedPlan, setSelectedPlan] = useState<StakingPlanId>("0");

	const handleStake = async () => {
		if (!isConnected) {
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

		const success = await stakeTokens(amount, selectedPlan);
		if (success) {
			setAmount("");
		}
	};

	const currentPlan = STAKING_PLANS[selectedPlan];

	// Dummy UI for non-connected users
	const DummyStakeUI = () => (
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
						{/* Dummy Staking Form */}
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}>
							<Card className="glass-effect border-purple-500/30 relative">
								<div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
									<div className="text-center">
										<Wallet className="w-16 h-16 mx-auto mb-4 text-purple-400" />
										<h3 className="text-xl font-semibold mb-2 text-gradient-purple-lime">
											Connect Your Wallet
										</h3>
										<p className="text-muted-foreground mb-6">
											Connect your wallet to start staking SPC tokens
										</p>
										<ConnectButton />
									</div>
								</div>
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
											value="1000"
											disabled
											className="mt-2 bg-transparent border-purple-500/30"
										/>
										<p className="text-sm text-muted-foreground mt-2">
											Available Balance: 0.00 SPC
										</p>
									</div>

									<div>
										<Label className="text-muted-foreground">Staking Plan</Label>
										<Tabs
											defaultValue="0"
											className="mt-2">
											<TabsList className="grid w-full grid-cols-2 md:grid-cols-4 glass-effect gap-2 border border-purple-500/30 h-fit">
												{Object.values(STAKING_PLANS).map((plan) => (
													<TabsTrigger
														key={plan.id}
														value={plan.id}
														className="data-[state=active]:bg-purple-500/20">
														{plan.name}
													</TabsTrigger>
												))}
											</TabsList>
											<TabsContent
												value="0"
												className="mt-4">
												<Card className="glass-effect border-lime-500/30">
													<CardContent className="p-4 space-y-2">
														<div className="flex items-center justify-between">
															<span className="text-muted-foreground">APY:</span>
															<span className="font-semibold text-lime-400 flex items-center">
																<Percent className="w-4 h-4 mr-1" />
																5%
															</span>
														</div>
														<div className="flex items-center justify-between">
															<span className="text-muted-foreground">Duration:</span>
															<span className="font-semibold text-purple-300 flex items-center">
																<Lock className="w-4 h-4 mr-1" />
																No Lock
															</span>
														</div>
														<div className="flex items-center justify-between">
															<span className="text-muted-foreground">Unstaking Fee:</span>
															<span className="font-semibold text-red-400 flex items-center">
																<Coins className="w-4 h-4 mr-1" />
																5%
															</span>
														</div>
													</CardContent>
												</Card>
											</TabsContent>
										</Tabs>
									</div>

									<Button
										disabled
										className="w-full gradient-purple-lime text-black font-semibold text-lg py-3 opacity-50">
										Connect Wallet to Stake
										<Zap className="w-5 h-5 ml-2" />
									</Button>
								</CardContent>
							</Card>
						</motion.div>

						{/* Dummy Staking Summary */}
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
										<span className="font-semibold text-foreground">1,000.00 SPC</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">Selected Plan:</span>
										<span className="font-semibold text-foreground">Flexible</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">
											Annual Percentage Yield (APY):
										</span>
										<span className="font-semibold text-lime-400">5%</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">Lock Duration:</span>
										<span className="font-semibold text-purple-300">No Lock</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">Unstaking Fee:</span>
										<span className="font-semibold text-red-400">5%</span>
									</div>
									<div className="flex items-center justify-between text-lg font-bold pt-4 border-t border-purple-500/20">
										<span className="text-gradient-purple-lime">Estimated Return:</span>
										<span className="text-gradient-purple-lime">50.00 SPC/Year</span>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);

	if (!isConnected) {
		return <DummyStakeUI />;
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
											Available Balance: {Number.parseFloat(balance).toFixed(4)} SPC
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
										disabled={isLoading || Number.parseFloat(amount) <= 0}
										className="w-full gradient-purple-lime text-black font-semibold text-lg py-3 glow-purple">
										{isLoading ? "Staking..." : "Stake Now"}
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
