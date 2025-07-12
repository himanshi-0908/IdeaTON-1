"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Mic, Shield, Users, Zap } from "lucide-react"
import { useAccessibility } from "@/components/accessibility-provider"

interface WalletLoginProps {
  onLogin: (userData: any) => void
}

export function WalletLogin({ onLogin }: WalletLoginProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const { speak } = useAccessibility()

  const handleWalletConnect = async () => {
    setIsConnecting(true)
    speak("Connecting to TON wallet for DecentVoice")

    // Simulate wallet connection
    setTimeout(() => {
      const userData = {
        address: "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t",
        balance: "89.25",
        username: `voice_${Math.random().toString(36).substr(2, 8)}`,
        avatar: "/placeholder.svg?height=40&width=40",
        isVerified: true,
        reputation: 95,
        totalSpeakingTime: "24h 15m",
        roomsHosted: 12,
      }

      onLogin(userData)
      speak("Successfully connected to DecentVoice")
      setIsConnecting(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center animate-pulse">
            <Mic className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              DecentVoice
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Anonymous, Encrypted Voice Chat Rooms</p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center hover:shadow-lg transition-shadow">
            <Shield className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-medium">P2P Encrypted</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-lg transition-shadow">
            <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-medium">DAO Governed</p>
          </Card>
        </div>

        {/* Login Card */}
        <Card className="border-2 border-purple-200 dark:border-purple-800">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Wallet className="h-5 w-5" />
              Connect TON Wallet
            </CardTitle>
            <CardDescription>Anonymous voice chat with blockchain identity verification</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleWalletConnect}
              disabled={isConnecting}
              className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              aria-label="Connect TON wallet to access DecentVoice"
            >
              {isConnecting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting...
                </div>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Enter Voice Rooms
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Features List */}
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <p className="text-sm font-medium text-green-800 dark:text-green-200">WebRTC P2P Voice Streaming</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  DAO Voting for Recording Permissions
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <p className="text-sm font-medium text-green-800 dark:text-green-200">Voice Commands & Accessibility</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <p className="text-sm font-medium text-green-800 dark:text-green-200">On-Chain Identity Verification</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
