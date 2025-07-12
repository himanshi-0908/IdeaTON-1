"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, TrendingUp, Clock, Award, Users, Zap } from "lucide-react"

interface VoiceAnalyticsProps {
  user: any
}

export function VoiceAnalytics({ user }: VoiceAnalyticsProps) {
  const [analytics, setAnalytics] = useState({
    totalSpeakingTime: "24h 15m",
    averageSessionTime: "45m",
    roomsJoined: 156,
    roomsHosted: 12,
    tipsReceived: 89.5,
    tipsSent: 45.2,
    voiceNFTsMinted: 8,
    voiceNFTsSold: 3,
    reputationScore: 95,
    weeklyGrowth: 12,
    topCategories: [
      { name: "Crypto Discussion", time: "8h 30m", percentage: 35 },
      { name: "Tech Talk", time: "6h 45m", percentage: 28 },
      { name: "NFT Showcase", time: "4h 20m", percentage: 18 },
      { name: "DAO Governance", time: "3h 15m", percentage: 13 },
      { name: "Other", time: "1h 25m", percentage: 6 },
    ],
    achievements: [
      { name: "Early Adopter", earned: true, rarity: "legendary" },
      { name: "Voice Master", earned: true, rarity: "epic" },
      { name: "Community Builder", earned: true, rarity: "rare" },
      { name: "Tip Champion", earned: false, rarity: "epic" },
      { name: "NFT Creator", earned: true, rarity: "rare" },
    ],
  })

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "text-yellow-500"
      case "epic":
        return "text-purple-500"
      case "rare":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-3">
        <BarChart className="h-8 w-8 text-blue-500" />
        <div>
          <h2 className="text-3xl font-bold">Voice Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Track your DecentVoice journey and achievements</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{analytics.totalSpeakingTime}</div>
            <div className="text-sm text-gray-500">Total Speaking Time</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{analytics.roomsJoined}</div>
            <div className="text-sm text-gray-500">Rooms Joined</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{analytics.tipsReceived}</div>
            <div className="text-sm text-gray-500">TON Tips Received</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{analytics.reputationScore}</div>
            <div className="text-sm text-gray-500">Reputation Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Speaking Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Speaking Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analytics.topCategories.map((category, index) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{category.name}</span>
                <div className="text-right">
                  <span className="text-sm font-medium">{category.time}</span>
                  <span className="text-xs text-gray-500 ml-2">({category.percentage}%)</span>
                </div>
              </div>
              <Progress value={category.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.achievements.map((achievement) => (
              <div
                key={achievement.name}
                className={`p-4 rounded-lg border-2 ${
                  achievement.earned
                    ? "border-green-200 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-200 bg-gray-50 dark:bg-gray-800 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{achievement.name}</h4>
                  <Badge
                    variant={achievement.earned ? "default" : "secondary"}
                    className={achievement.earned ? getRarityColor(achievement.rarity) : ""}
                  >
                    {achievement.rarity}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">{achievement.earned ? "🏆" : "🔒"}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {achievement.earned ? "Unlocked!" : "Locked"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>This Week's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Reputation Growth</span>
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-medium">+{analytics.weeklyGrowth}</span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Average Session Time</span>
              <span className="font-medium">{analytics.averageSessionTime}</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Rooms Hosted This Week</span>
              <span className="font-medium">3</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Tips Received This Week</span>
              <span className="font-medium text-yellow-600">12.5 TON</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
