"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, X } from "lucide-react"

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDeferredPrompt(null)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="glass-effect border-purple-500/30">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">Install SupaStake</h3>
              <p className="text-xs text-muted-foreground mb-3">Install our app for a better experience</p>
              <div className="flex gap-2">
                <Button onClick={handleInstall} size="sm" className="gradient-purple-lime text-black font-semibold">
                  <Download className="w-3 h-3 mr-1" />
                  Install
                </Button>
                <Button onClick={handleDismiss} size="sm" variant="ghost" className="text-muted-foreground">
                  Later
                </Button>
              </div>
            </div>
            <Button onClick={handleDismiss} size="sm" variant="ghost" className="p-1 h-auto text-muted-foreground">
              <X className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
