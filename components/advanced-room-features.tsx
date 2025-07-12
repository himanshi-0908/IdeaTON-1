"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Globe, Zap, TrendingUp, Award, MessageSquare, BarChart3, Headphones, Mic2 } from "lucide-react"
import { useAccessibility } from "@/components/accessibility-provider"

export function AdvancedRoomFeatures() {
  const [aiInsights, setAiInsights] = useState({
    sentiment: "positive",
    engagement: 87,
    topicTrends: ["cryptocurrency", "NFTs", "blockchain"],
    speakingTime: { balanced: true, distribution: [30, 25, 20, 15, 10] },
    recommendations: [
      "Consider inviting more speakers to increase engagement",
      "The current topic is trending - great timing!",
      "Room energy is high - perfect for NFT drops",
    ],
  })

  const [liveTranscription, setLiveTranscription] = useState([
    { speaker: "alice_crypto", text: "The future of decentralized finance is really exciting...", timestamp: "2m ago" },
    { speaker: "bob_builder", text: "I agree, especially with the new TON developments", timestamp: "1m ago" },
    { speaker: "crypto_dev", text: "Has anyone tried the new DeFi protocols?", timestamp: "30s ago" },
  ])

  const [spatialAudio, setSpatialAudio] = useState({
    enabled: false,
    participants: [
      { id: "1", username: "alice_crypto", position: { x: -0.5, y: 0.8 }, volume: 0.8 },
      { id: "2", username: "bob_builder", position: { x: 0.3, y: 0.6 }, volume: 0.9 },
      { id: "3", username: "crypto_dev", position: { x: 0.0, y: -0.4 }, volume: 0.7 },
    ],
  })

  const { speak } = useAccessibility()

  return (
    <div className="space-y-6">
      <Tabs defaultValue="ai-insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="transcription">Live Text</TabsTrigger>
          <TabsTrigger value="spatial">3D Audio</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                AI Room Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{aiInsights.engagement}%</div>
                  <div className="text-sm text-gray-600">Engagement Score</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 capitalize">{aiInsights.sentiment}</div>
                  <div className="text-sm text-gray-600">Room Sentiment</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Trending Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {aiInsights.topicTrends.map((topic, index) => (
                    <Badge key={topic} variant="outline" className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">AI Recommendations</h4>
                <div className="space-y-2">
                  {aiInsights.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <Zap className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transcription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                Live Transcription
                <Badge variant="secondary" className="ml-auto">
                  Real-time
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {liveTranscription.map((entry, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-shrink-0">
                      <Badge variant="outline" className="text-xs">
                        {entry.speaker}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{entry.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{entry.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-blue-800 dark:text-blue-200">Auto-Translation Active</span>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Conversations are being translated to English in real-time
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spatial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-green-500" />
                3D Spatial Audio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg overflow-hidden">
                {/* Virtual Room Visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Mic2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="absolute -bottom-6 text-xs font-medium">You</span>
                </div>

                {/* Other Participants */}
                {spatialAudio.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="absolute w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${50 + participant.position.x * 40}%`,
                      top: `${50 - participant.position.y * 40}%`,
                    }}
                  >
                    <div className="w-2 h-2 bg-white rounded-full" />
                    <div className="absolute -bottom-6 text-xs whitespace-nowrap">{participant.username}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Spatial Audio</span>
                  <Button
                    size="sm"
                    variant={spatialAudio.enabled ? "default" : "outline"}
                    onClick={() => setSpatialAudio((prev) => ({ ...prev, enabled: !prev.enabled }))}
                  >
                    {spatialAudio.enabled ? "Enabled" : "Enable"}
                  </Button>
                </div>

                {spatialAudio.enabled && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      🎧 Experience immersive 3D audio positioning
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="font-medium">Distance</div>
                        <div className="text-gray-500">Affects volume</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="font-medium">Direction</div>
                        <div className="text-gray-500">Left/Right audio</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="font-medium">Movement</div>
                        <div className="text-gray-500">Dynamic positioning</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-500" />
                Room Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">2.5h</div>
                  <div className="text-xs text-gray-600">Session Length</div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-xl font-bold text-green-600">24</div>
                  <div className="text-xs text-gray-600">Peak Participants</div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">156</div>
                  <div className="text-xs text-gray-600">Total Joins</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-xl font-bold text-yellow-600">45m</div>
                  <div className="text-xs text-gray-600">Avg Stay Time</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Speaking Time Distribution</h4>
                <div className="space-y-2">
                  {["alice_crypto", "bob_builder", "crypto_dev", "nft_artist", "others"].map((speaker, index) => (
                    <div key={speaker} className="flex items-center gap-3">
                      <div className="w-20 text-sm font-medium">{speaker}</div>
                      <div className="flex-1">
                        <Progress value={aiInsights.speakingTime.distribution[index]} className="h-2" />
                      </div>
                      <div className="w-12 text-sm text-gray-500">{aiInsights.speakingTime.distribution[index]}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">Balanced Discussion</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Great job maintaining an inclusive conversation where everyone gets to speak!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
