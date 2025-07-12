"use client"

import { useState, useEffect } from "react"
import { WalletLogin } from "@/components/wallet-login"
import { MainApp } from "@/components/main-app"
import { AccessibilityProvider } from "@/components/accessibility-provider"
import { VoiceProvider } from "@/components/voice-provider"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("decentvoice-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (userData: any) => {
    setUser(userData)
    setIsLoggedIn(true)
    localStorage.setItem("decentvoice-user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem("decentvoice-user")
  }

  return (
    <AccessibilityProvider>
      <VoiceProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
          {!isLoggedIn ? <WalletLogin onLogin={handleLogin} /> : <MainApp user={user} onLogout={handleLogout} />}
          <Toaster />
        </div>
      </VoiceProvider>
    </AccessibilityProvider>
  )
}
