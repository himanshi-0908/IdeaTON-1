"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, ShoppingCart, Palette, Mic, Crown, Zap } from "lucide-react"
import { useVoice } from "@/components/voice-provider"
import { useAccessibility } from "@/components/accessibility-provider"
import { useToast } from "@/hooks/use-toast"

interface NFTMarketplaceProps {
  user: any
}

export function NFTMarketplace({ user }: NFTMarketplaceProps) {
  const [playingNFT, setPlayingNFT] = useState<string | null>(null)
  const [marketplaceNFTs, setMarketplaceNFTs] = useState<any[]>([])

  const { voiceNFTs, roomNFTs, mintVoiceNFT, purchaseRoomNFT } = useVoice()
  const { speak } = useAccessibility()
  const { toast } = useToast()

  useEffect(() => {
    // Load marketplace NFTs
    const sampleNFTs = [
      {
        id: "1",
        type: "voice",
        name: "Epic Crypto Rant #001",
        description: "Legendary 5-minute crypto analysis that predicted the bull run",
        creator: "crypto_prophet",
        price: 15.5,
        duration: "5:23",
        plays: 1247,
        likes: 89,
        rarity: "legendary",
        audioUrl: "/placeholder-audio.mp3",
      },
      {
        id: "2",
        type: "room",
        name: "VIP Whale Room Access",
        description: "Exclusive access to high-stakes trading discussions",
        creator: "whale_master",
        price: 50.0,
        members: 25,
        maxMembers: 50,
        rarity: "epic",
        perks: ["Priority speaking", "Exclusive alpha", "Direct whale contact"],
      },
      {
        id: "3",
        type: "voice",
        name: "Motivational Monday #42",
        description: "Inspiring speech that went viral in the community",
        creator: "motivation_guru",
        price: 3.2,
        duration: "2:15",
        plays: 5632,
        likes: 234,
        rarity: "rare",
        audioUrl: "/placeholder-audio.mp3",
      },
      {
        id: "4",
        type: "badge",
        name: "OG Speaker Badge",
        description: "Exclusive badge for early platform adopters",
        creator: "decentvoice_official",
        price: 25.0,
        holders: 100,
        maxSupply: 500,
        rarity: "epic",
        benefits: ["Special profile flair", "Priority room access", "Governance voting power"],
      },
    ]
    setMarketplaceNFTs(sampleNFTs)
  }, [])

  const handlePlayNFT = (nftId: string) => {
    if (playingNFT === nftId) {
      setPlayingNFT(null)
      speak("Audio stopped")
    } else {
      setPlayingNFT(nftId)
      speak("Playing voice NFT")
    }
  }

  const handlePurchaseNFT = (nft: any) => {
    speak(`Purchasing ${nft.name} for ${nft.price} TON`)
    toast({
      title: "NFT Purchased! 🎉",
      description: `You now own "${nft.name}" for ${nft.price} TON`,
    })
  }

  const handleMintCurrentVoice = () => {
    // Simulate creating audio blob
    const audioBlob = new Blob(["fake audio data"], { type: "audio/wav" })
    mintVoiceNFT(audioBlob)
    speak("Voice NFT minted successfully")
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "text-yellow-500 border-yellow-500"
      case "epic":
        return "text-purple-500 border-purple-500"
      case "rare":
        return "text-blue-500 border-blue-500"
      default:
        return "text-gray-500 border-gray-500"
    }
  }

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "bg-gradient-to-br from-yellow-400 to-orange-500"
      case "epic":
        return "bg-gradient-to-br from-purple-400 to-pink-500"
      case "rare":
        return "bg-gradient-to-br from-blue-400 to-cyan-500"
      default:
        return "bg-gradient-to-br from-gray-400 to-gray-500"
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            NFT Marketplace
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Collect unique voice moments and exclusive access</p>
        </div>
        <Button
          onClick={handleMintCurrentVoice}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Palette className="h-4 w-4 mr-2" />
          Mint Voice NFT
        </Button>
      </div>

      <Tabs defaultValue="marketplace" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="my-nfts">My NFTs</TabsTrigger>
          <TabsTrigger value="voice-nfts">Voice NFTs</TabsTrigger>
          <TabsTrigger value="room-access">Room Access</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplaceNFTs.map((nft) => (
              <Card
                key={nft.id}
                className={`hover:shadow-xl transition-all duration-300 border-2 ${getRarityColor(nft.rarity)}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{nft.name}</CardTitle>
                        <Badge variant="outline" className={getRarityColor(nft.rarity)}>
                          {nft.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{nft.description}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* NFT Preview */}
                  <div
                    className={`relative h-32 rounded-lg ${getRarityBg(nft.rarity)} flex items-center justify-center`}
                  >
                    {nft.type === "voice" && (
                      <div className="text-center text-white">
                        <Mic className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">{nft.duration}</p>
                        <Button size="sm" variant="secondary" onClick={() => handlePlayNFT(nft.id)} className="mt-2">
                          {playingNFT === nft.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                      </div>
                    )}
                    {nft.type === "room" && (
                      <div className="text-center text-white">
                        <Crown className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">
                          {nft.members}/{nft.maxMembers} members
                        </p>
                      </div>
                    )}
                    {nft.type === "badge" && (
                      <div className="text-center text-white">
                        <Zap className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">
                          {nft.holders}/{nft.maxSupply}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Creator Info */}
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg" alt={nft.creator} />
                      <AvatarFallback>{nft.creator[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600 dark:text-gray-400">by {nft.creator}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    {nft.type === "voice" && (
                      <>
                        <span>{nft.plays.toLocaleString()} plays</span>
                        <span>❤️ {nft.likes}</span>
                      </>
                    )}
                    {nft.type === "room" && (
                      <div className="space-y-1">
                        {nft.perks.map((perk: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs mr-1">
                            {perk}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {nft.type === "badge" && (
                      <div className="space-y-1">
                        {nft.benefits.map((benefit: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs mr-1">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Purchase */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-lg font-bold text-purple-600">{nft.price} TON</div>
                    <Button
                      onClick={() => handlePurchaseNFT(nft)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-nfts" className="space-y-4">
          <div className="text-center py-8">
            <Palette className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your NFT Collection</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Your purchased and minted NFTs will appear here</p>
            <Button onClick={handleMintCurrentVoice} variant="outline">
              <Mic className="h-4 w-4 mr-2" />
              Mint Your First Voice NFT
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="voice-nfts" className="space-y-4">
          {voiceNFTs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {voiceNFTs.map((nft) => (
                <Card key={nft.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{nft.name}</h4>
                        <Badge variant="default">Owned</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{nft.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">{nft.price.toFixed(2)} TON</span>
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Mic className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Voice NFTs Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first voice NFT by recording in a room
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="room-access" className="space-y-4">
          <div className="text-center py-8">
            <Crown className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Premium Room Access</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Purchase NFTs to access exclusive rooms and features
            </p>
            <Button variant="outline">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Browse Room NFTs
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
