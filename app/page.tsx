"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { FloatingElements } from "@/components/floating-elements"
import { BackgroundGrid } from "@/components/background-grid"
import { Logo } from "@/components/logo"
import { Coins, TrendingUp, Shield, Zap, ArrowRight, Star, Users, Award } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: Coins,
      title: "Multiple Staking Plans",
      description: "Choose from flexible to 1-year locked staking with varying APY rates",
    },
    {
      icon: TrendingUp,
      title: "High Yield Returns",
      description: "Earn up to 25% APY on your SPC tokens with our premium staking plans",
    },
    {
      icon: Shield,
      title: "Secure & Audited",
      description: "Smart contracts audited for maximum security of your staked assets",
    },
    {
      icon: Zap,
      title: "Instant Rewards",
      description: "Real-time reward calculation and instant claiming capabilities",
    },
  ]

  const stats = [
    { label: "Total Value Locked", value: "$2.5M+", icon: Coins },
    { label: "Active Stakers", value: "1,200+", icon: Users },
    { label: "Rewards Distributed", value: "$450K+", icon: Award },
    { label: "Average APY", value: "18.5%", icon: Star },
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BackgroundGrid />
      <FloatingElements />
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-purple-500/30 mb-6">
              <Logo variant="logo" className="w-6 h-6" />
              <span className="text-sm text-purple-300">Powered by SupaDao</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Stake <span className="text-gradient-purple-lime">SPC</span>
              <br />
              Earn <span className="text-gradient-purple-lime">Rewards</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Join thousands of users earning passive income through our secure, high-yield staking platform. Multiple
              plans, instant rewards, maximum returns.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  className="gradient-purple-lime text-black font-semibold text-lg px-8 py-4 glow-purple"
                >
                  <Link href="/stake">
                    Start Staking
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="glass-effect border-purple-500/50 text-purple-300 hover:bg-purple-500/10 px-8 py-4 bg-transparent"
                >
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="glass-effect border-purple-500/30 text-center">
                <CardContent className="p-6">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-lime-400" />
                  <div className="text-2xl font-bold text-gradient-purple-lime mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="text-gradient-purple-lime">SupaStake</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of DeFi staking with our innovative platform designed for maximum returns and user
              experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <Card className="glass-effect border-lime-500/30 hover:glow-lime transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <feature.icon className="w-12 h-12 text-lime-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-3 text-gradient-purple-lime">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="glass-effect border-purple-500/30 glow-purple">
              <CardContent className="p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Start <span className="text-gradient-purple-lime">Earning</span>?
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Join the SupaStake community and start earning rewards on your SPC tokens today.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild size="lg" className="gradient-purple-lime text-black font-semibold text-lg px-8 py-4">
                    <Link href="/stake">
                      Get Started Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
