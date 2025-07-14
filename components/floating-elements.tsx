"use client"

import { motion } from "framer-motion"

export function FloatingElements() {
  return (
    <>
      <motion.div
        className="absolute top-1/4 left-1/4 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 0.2 }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-48 h-48 bg-lime-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 0.2 }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 0.2 }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      />
    </>
  )
}
