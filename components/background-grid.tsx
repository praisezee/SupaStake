"use client"

import { motion } from "framer-motion"

export function BackgroundGrid() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden grid-background opacity-20 pointer-events-none">
      {/* Static Grid Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-purple-500/0 via-purple-500/40 to-purple-500/0" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-lime-500/0 via-lime-500/40 to-lime-500/0" />
      </div>

      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="url(#gridGradient)" strokeWidth="1" />
            </pattern>
            <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#aa6ce8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#cbfc00" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Grid Nodes */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 2 === 0 ? "#aa6ce8" : "#cbfc00",
            left: `${(i % 5) * 20 + 10}%`,
            top: `${Math.floor(i / 5) * 25 + 10}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Connecting Lines Animation */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.line
            key={i}
            x1={`${Math.random() * 100}%`}
            y1={`${Math.random() * 100}%`}
            x2={`${Math.random() * 100}%`}
            y2={`${Math.random() * 100}%`}
            stroke="url(#lineGradient)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: i * 0.5,
            }}
          />
        ))}
        <defs>
          <linearGradient id="lineGradient">
            <stop offset="0%" stopColor="#aa6ce8" />
            <stop offset="100%" stopColor="#cbfc00" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
