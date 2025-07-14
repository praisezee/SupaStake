"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { FloatingElements } from "@/components/floating-elements"
import { BackgroundGrid } from "@/components/background-grid"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BackgroundGrid />
      <FloatingElements />
      <Navbar />

      <div className="relative z-10 pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-purple-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-lime-400" />
              <span className="text-sm text-purple-300">Decentralized Staking Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Stake <span className="text-gradient-purple-lime">SPC</span>, Earn{" "}
              <span className="text-gradient-purple-lime">Rewards</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Securely stake your SPC tokens and earn high yields with flexible and fixed-term plans.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/stake" passHref>
                <Button
                  size="lg"
                  className="gradient-purple-lime text-black font-semibold text-lg px-8 py-4 glow-purple"
                >
                  Start Staking
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
