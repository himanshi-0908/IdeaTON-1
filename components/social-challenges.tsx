"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy } from "lucide-react"
import { useAccessibility } from "@/components/accessibility-provider"
import { useToast } from "@/hooks/use-toast"

export function SocialChallenges() {
  const [challenges, setChallenges] = useState([
    {
      id: "1",
      title: "Voice Marathon",
      description: "Speak for a total of 10 hours this month",
      type: "monthly",
      progress: 6.5,
      target: 10,
      reward: "50 TON + Exclusive Badge",
      participants: 234,
      timeLeft: "12 days",
      difficulty: "medium",
      category: "speaking",
    },
    {
      id: "2", 
      title: "Room Host Challenge",
      description: "Successfully host 5 rooms with 20+ participants",
      type: "weekly",
      progress: 2,
      target: 5,
      reward: "25 TON + Host Crown NFT",
      participants: 89,
      timeLeft: "3 days",
      difficulty: "hard",
      category: "hosting",
    },
    {
      id: "3",
      title: "Tip Generosity",
      description: "Send tips to 50 different speakers",
      type: "monthly",
      progress: 23,
      target: 50,
      reward: "Generous Tipper Badge + 10 TON",
      participants: 156,
      timeLeft: "18 days",
      difficulty: "easy",
      category: "community",
    },
    {
      id: "4",
      title: "NFT Creator Sprint",
      description: "Mint 3 Voice NFTs that get 100+ plays each",
      type: "weekly",
      progress: 1,
      target: 3,
      reward: "Creator Badge + Featured Placement",
      participants: 67,
      timeLeft: "5 days",
      difficulty: "hard",
      category: "nft",
    },
  ])

  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, username: "voice_legend", score: 2450, avatar: "/placeholder.svg" },
    { rank: 2, username: "crypto_speaker", score: 2380, avatar: "/placeholder.svg" },
    { rank: 3, username: "nft_creator", score: 2290, avatar: "/placeholder.svg" },
    { rank: 4, username: "community_hero", score: 2150, avatar: "/placeholder.svg" },
    { rank: 5, username: "tip_master", score: 2080, avatar: "/placeholder.svg" },
  ])

  const { speak } = useAccessibility()
  const { toast } = useToast()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-500 border-green-500"
      case "medium": return "text-yellow-500 border-yellow-500"
      case "hard": return "text-red-500 border-red-500"
      default: return "text-gray-500 border-gray-500"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "speaking": return "🎤"
      case "hosting": return "👑"
      case "community": return "🤝"
      case "nft": return "🎨"
      default: return "🎯"
    }
  }

  const handleJoinChallenge = (challengeId: string, title: string) => {
    speak(`Joined ${title} challenge`)
    toast({
      title: "Challenge Joined! 🎯",
      description: `You're now participating in ${title}`,
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-yellow-500" />
        <div>
          <h2 className="text-3xl font-bold">Social Challenges</h2>
          <p className="text-gray-600 dark:text-gray-400">Compete, earn rewards, and build your reputation</p>
        </div>
      </div>

      {/* Active Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getCategoryIcon(challenge.category)}</div>
                  <div>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">
                    {challenge.progress} / {challenge.target}
                  </span>
                </div>
                <Progress value={(challenge.progress / challenge.target) * 100} className="h\
