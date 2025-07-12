"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Coins, TrendingUp, Gift, Star } from "lucide-react"
import { useVoice } from "@/components/voice-provider"
import { useAccessibility } from "@/components/accessibility-provider"

interface TippingPanelProps {
  speakers: any[]
  user: any
}

export function TippingPanel({ speakers, user }: TippingPanelProps) {
  const [selectedSpeaker, setSelectedSpeaker] = useState<string | null>(null)
  const [tipAmount, setTipAmount] = useState("")
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const { tipSpeaker, tipHistory } = useVoice()
  const { speak } = useAccessibility()

  const quickTipAmounts = [0.1, 0.5, 1, 2, 5, 10]

  const handleTip = (speakerId: string, amount: number) => {
    tipSpeaker(speakerId, amount)
    speak(`Tipped ${amount} TON to speaker`)
    setSelectedSpeaker(null)
    setTipAmount("")
  }

  const topTippers = tipHistory
    .reduce((acc: any[], tip) => {
      const existing = acc.find((t) => t.speakerId === tip.speakerId)
      if (existing) {
        existing.total += tip.amount
        existing.count += 1
      } else {
        acc.push({ speakerId: tip.speakerId, total: tip.amount, count: 1 })
      }
      return acc
    }, [])
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-500" />
            TON Tipping
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => setShowLeaderboard(!showLeaderboard)}>
            <TrendingUp className="h-4 w-4 mr-1" />
            {showLeaderboard ? "Hide" : "Show"} Leaderboard
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {showLeaderboard && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">🏆 Top Tipped Speakers</h4>
            {topTippers.map((tipper, index) => {
              const speaker = speakers.find((s) => s.id === tipper.speakerId)
              return (
                <div
                  key={tipper.speakerId}
                  className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                      {index + 1}
                    </Badge>
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={speaker?.avatar || "/placeholder.svg"} alt={speaker?.username} />
                      <AvatarFallback>{speaker?.username?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{speaker?.username}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-yellow-600">{tipper.total.toFixed(2)} TON</div>
                    <div className="text-xs text-gray-500">{tipper.count} tips</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-semibold text-sm">💝 Tip Active Speakers</h4>
          <div className="grid grid-cols-1 gap-2">
            {speakers
              .filter((s) => s.id !== user.id)
              .map((speaker) => (
                <div
                  key={speaker.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedSpeaker === speaker.id
                      ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
                      : "border-gray-200 hover:border-yellow-200"
                  }`}
                  onClick={() => setSelectedSpeaker(selectedSpeaker === speaker.id ? null : speaker.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={speaker.avatar || "/placeholder.svg"} alt={speaker.username} />
                        <AvatarFallback>{speaker.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{speaker.username}</p>
                        <div className="flex items-center gap-2">
                          {speaker.isSpeaking && (
                            <Badge variant="default" className="text-xs">
                              🎤 Speaking
                            </Badge>
                          )}
                          {speaker.role === "host" && (
                            <Badge variant="secondary" className="text-xs">
                              👑 Host
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs">
                          {tipHistory.filter((t) => t.speakerId === speaker.id).length} tips
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedSpeaker === speaker.id && (
                    <div className="mt-3 pt-3 border-t space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        {quickTipAmounts.map((amount) => (
                          <Button
                            key={amount}
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleTip(speaker.id, amount)
                            }}
                            className="text-xs"
                          >
                            {amount} TON
                          </Button>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Custom amount"
                          value={tipAmount}
                          onChange={(e) => setTipAmount(e.target.value)}
                          className="text-sm"
                          step="0.1"
                          min="0.1"
                        />
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            const amount = Number.parseFloat(tipAmount)
                            if (amount > 0) {
                              handleTip(speaker.id, amount)
                            }
                          }}
                          disabled={!tipAmount || Number.parseFloat(tipAmount) <= 0}
                          className="bg-yellow-500 hover:bg-yellow-600"
                        >
                          <Gift className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {tipHistory.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">📊 Recent Tips</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {tipHistory.slice(0, 5).map((tip) => {
                const speaker = speakers.find((s) => s.id === tip.speakerId)
                return (
                  <div
                    key={tip.id}
                    className="flex items-center justify-between text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <span>→ {speaker?.username}</span>
                    <span className="font-medium text-yellow-600">{tip.amount} TON</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
