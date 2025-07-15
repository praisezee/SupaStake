import Image from "next/image"

interface LogoProps {
  variant?: "logo" | "wordmark"
  className?: string
}

export function Logo({ variant = "logo", className = "" }: LogoProps) {
  const src = variant === "logo" ? "/supadao-logo.png" : "/supadao-wordmark.png"
  const alt = variant === "logo" ? "SupaDao Logo" : "SupaDao Wordmark"

  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      width={variant === "logo" ? 40 : 120}
      height={40}
      className={className}
      priority
    />
  )
}
