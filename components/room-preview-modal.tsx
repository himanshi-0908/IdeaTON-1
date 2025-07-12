"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, Shield, Crown, Zap, Volume2, Lock, Star, TrendingUp, Palette } from "lucide-react"
import { useAccessibility } from "@/components/accessibility-provider"
import { useToast } from "@/hooks/use-toast"

interface RoomPreviewModalProps {
  room: any
  isOpen: boolean
  onClose: () => void
  onJoin: (roomId: string) => void
}

export function RoomPreviewModal({ room, isOpen, onClose, onJoin }: RoomPreviewModalProps) {
  const [isJoining, setIsJoining] = useState(false)
  const [liveStats, setLiveStats] = useState({
    participants: room?.participants || 0,
    speakers: room?.speakers || 0,
    avgStayTime: "45m",
    peakTime: "2.5h ago",
  })

  const { speak } = useAccessibility()
  const { toast } = useToast()

  // Simulate live participant updates
  useEffect(() => {
    if (!isOpen || !room) return

    const interval = setInterval(() => {
      setLiveStats((prev) => ({
        ...prev,
        participants: prev.participants + Math.floor(Math.random() * 3) - 1,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [isOpen, room])

  const handleJoin = async () => {
    if (!room) return

    setIsJoining(true)
    speak(`Joining ${room.name}`)

    // Simulate connection delay with loading animation
    setTimeout(() => {
      onJoin(room.id)
      setIsJoining(false)
      onClose()
    }, 2000)
  }

  const mockParticipants = [
    { id: "1", username: "alice_crypto", avatar: "/placeholder.svg", isSpeaking: true, role: "host" },
    { id: "2", username: "bob_builder", avatar: "/placeholder.svg", isSpeaking: false, role: "speaker" },
    { id: "3", username: "crypto_dev", avatar: "/placeholder.svg", isSpeaking: true, role: "speaker" },
    { id: "4", username: "nft_artist", avatar: "/placeholder.svg", isSpeaking: false, role: "listener" },
  ]

  const roomPerks = [
    { icon: "🎤", title: "High Quality Audio", description: "Crystal clear voice streaming" },
    { icon: "🔒", title: "End-to-End Encrypted", description: "Your conversations are private" },
    { icon: "🎨", title: "NFT Integration", description: "Mint voice moments as NFTs" },
    { icon: "💰", title: "TON Tipping", description: "Tip speakers with cryptocurrency" },
  ]

  if (!room) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            {room.name}
            {room.verified && <Shield className="h-5 w-5 text-green-500" />}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Room Header with Live Stats */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{liveStats.participants}</div>
                  <div className="text-sm text-gray-600">Participants</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{liveStats.speakers}</div>
                  <div className="text-sm text-gray-600">Speakers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{liveStats.avgStayTime}</div>
                  <div className="text-sm text-gray-600">Avg Stay</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{room.startTime}</div>
                  <div className="text-sm text-gray-600">Started</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="nfts">NFTs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">About This Room</h3>
                  <p className="text-gray-600 dark:text-gray-400">{room.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {room.tags?.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">Host</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={room.host?.avatar || "/placeholder.svg"} alt={room.host?.username} />
                          <AvatarFallback>{room.host?.username?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{room.host?.username}</p>
                          <p className="text-xs text-gray-500">⭐ 4.8 rating</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Activity</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">Peak: {liveStats.peakTime}</p>
                        <p className="text-xs text-gray-500">Very active room</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="participants" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Current Speakers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mockParticipants
                      .filter((p) => p.role !== "listener")
                      .map((participant) => (
                        <Card
                          key={participant.id}
                          className={`transition-all ${participant.isSpeaking ? "ring-2 ring-green-400" : ""}`}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={participant.avatar || "/placeholder.svg"}
                                    alt={participant.username}
                                  />
                                  <AvatarFallback>{participant.username[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                {participant.isSpeaking && (
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <Volume2 className="w-2 h-2 text-white" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-sm">{participant.username}</p>
                                  {participant.role === "host" && <Crown className="h-3 w-3 text-yellow-500" />}
                                </div>
                                <p className="text-xs text-gray-500">
                                  {participant.isSpeaking ? "🎤 Speaking" : "🔇 Muted"}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Listeners ({liveStats.participants - 3})</h3>
                  <div className="flex -space-x-2">
                    {Array.from({ length: Math.min(liveStats.participants - 3, 10) }).map((_, i) => (
                      <Avatar key={i} className="h-8 w-8 border-2 border-white">
                        <AvatarImage src="/placeholder.svg" alt={`Listener ${i + 1}`} />
                        <AvatarFallback>L{i + 1}</AvatarFallback>
                      </Avatar>
                    ))}
                    {liveStats.participants - 3 > 10 && (
                      <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                        +{liveStats.participants - 13}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roomPerks.map((perk, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{perk.icon}</div>
                        <div>
                          <h4 className="font-semibold">{perk.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{perk.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {room.premiumFeatures?.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold text-yellow-800 dark:text-yellow-200">Premium Features</span>
                    </div>
                    <div className="space-y-1">
                      {room.premiumFeatures.map((feature: string, index: number) => (
                        <p key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
                          • {feature}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="nfts" className="space-y-4">
              <div className="text-center py-8">
                <Palette className="h-16 w-16 mx-auto text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Room NFT Collection</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Exclusive NFTs available in this room</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-purple-200">
                    <CardContent className="p-4 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <Mic className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="font-semibold">Voice Moment NFT</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Mint your speaking moments</p>
                      <Badge variant="outline" className="mt-2">
                        Available
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200">
                    <CardContent className="p-4 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        <Lock className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="font-semibold">VIP Access Pass</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Exclusive room privileges</p>
                      <Badge variant="outline" className="mt-2">
                        5.5 TON
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Join Button */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleJoin}
              disabled={isJoining}
              className="flex-1 h-12 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isJoining ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting...
                </div>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Join Room
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose} className="px-6 bg-transparent">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
