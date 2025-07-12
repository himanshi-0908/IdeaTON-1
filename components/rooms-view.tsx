"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mic, Users, Lock, Search, Plus, Zap, Shield, Clock } from "lucide-react"
import { useVoice } from "@/components/voice-provider"
import { useAccessibility } from "@/components/accessibility-provider"
import { useToast } from "@/hooks/use-toast"
import { RoomPreviewModal } from "@/components/room-preview-modal"
import { RoomCreationModal } from "@/components/room-creation-modal"

interface RoomsViewProps {
  user: any
}

export function RoomsView({ user }: RoomsViewProps) {
  const [rooms, setRooms] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const { joinRoom } = useVoice()
  const { speak } = useAccessibility()
  const { toast } = useToast()

  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showCreation, setShowCreation] = useState(false)
  const [createdRooms, setCreatedRooms] = useState<any[]>([])

  useEffect(() => {
    // Load sample rooms
    const sampleRooms = [
      {
        id: "1",
        name: "🚀 TON Blockchain Discussion",
        description: "Weekly discussion about TON ecosystem developments",
        participants: 24,
        speakers: 4,
        isLive: true,
        isPrivate: false,
        host: { username: "ton_dev", avatar: "/placeholder.svg" },
        tags: ["blockchain", "ton", "development"],
        startTime: "2 hours ago",
        recordingEnabled: false,
        verified: true,
      },
      {
        id: "2",
        name: "🎨 NFT Artists Showcase",
        description: "Artists presenting their latest NFT collections",
        participants: 156,
        speakers: 8,
        isLive: true,
        isPrivate: false,
        host: { username: "crypto_artist", avatar: "/placeholder.svg" },
        tags: ["nft", "art", "showcase"],
        startTime: "45 minutes ago",
        recordingEnabled: true,
        verified: true,
      },
      {
        id: "3",
        name: "🔒 Private DAO Meeting",
        description: "Governance discussion for token holders",
        participants: 12,
        speakers: 3,
        isLive: true,
        isPrivate: true,
        host: { username: "dao_admin", avatar: "/placeholder.svg" },
        tags: ["dao", "governance", "private"],
        startTime: "1 hour ago",
        recordingEnabled: false,
        verified: true,
      },
      {
        id: "4",
        name: "🌍 Web3 Accessibility",
        description: "Making blockchain technology accessible to everyone",
        participants: 67,
        speakers: 5,
        isLive: true,
        isPrivate: false,
        host: { username: "access_advocate", avatar: "/placeholder.svg" },
        tags: ["accessibility", "web3", "inclusion"],
        startTime: "30 minutes ago",
        recordingEnabled: false,
        verified: true,
      },
    ]
    setRooms(sampleRooms)
  }, [])

  const handleJoinRoom = async (roomId: string, roomName?: string) => {
    const room = rooms.find((r) => r.id === roomId) || createdRooms.find((r) => r.id === roomId)
    if (room) {
      speak(`Joining ${room.name}`)
      await joinRoom(roomId)
    }
  }

  const handleRoomClick = (room: any) => {
    setSelectedRoom(room)
    setShowPreview(true)
  }

  const handleCreateRoom = () => {
    setShowCreation(true)
    speak("Opening room creation")
  }

  const handleRoomCreated = (newRoom: any) => {
    setCreatedRooms((prev) => [newRoom, ...prev])
    setRooms((prev) => [newRoom, ...prev])
  }

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Voice Rooms
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Join decentralized voice conversations</p>
        </div>
        <Button
          onClick={handleCreateRoom}
          disabled={isCreatingRoom}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          aria-label="Create new voice room"
        >
          {isCreatingRoom ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Create Room
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search rooms by name, topic, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          aria-label="Search voice rooms"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{rooms.length}</div>
          <div className="text-sm text-gray-500">Active Rooms</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {rooms.reduce((sum, room) => sum + room.participants, 0)}
          </div>
          <div className="text-sm text-gray-500">Total Listeners</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{rooms.reduce((sum, room) => sum + room.speakers, 0)}</div>
          <div className="text-sm text-gray-500">Active Speakers</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">24/7</div>
          <div className="text-sm text-gray-500">Uptime</div>
        </Card>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRooms.map((room) => (
          <Card
            key={room.id}
            className="hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200 dark:hover:border-purple-800"
            onClick={() => handleRoomClick(room)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                    {room.verified && <Shield className="h-4 w-4 text-green-500" />}
                    {room.isLive && (
                      <Badge variant="destructive" className="animate-pulse">
                        LIVE
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{room.description}</p>
                </div>
                {room.isPrivate && <Lock className="h-4 w-4 text-gray-400" />}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Host Info */}
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={room.host.avatar || "/placeholder.svg"} alt={room.host.username} />
                  <AvatarFallback>{room.host.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600 dark:text-gray-400">Hosted by {room.host.username}</span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>{room.participants}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mic className="h-4 w-4 text-green-500" />
                    <span>{room.speakers}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{room.startTime}</span>
                  </div>
                </div>
                {room.recordingEnabled && (
                  <Badge variant="outline" className="text-xs">
                    Recording
                  </Badge>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {room.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Join Button */}
              <Button
                onClick={() => handleJoinRoom(room.id, room.name)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                aria-label={`Join ${room.name} voice room`}
              >
                <Zap className="h-4 w-4 mr-2" />
                Join Room
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No rooms found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or create a new room</p>
            </div>
            <Button onClick={handleCreateRoom} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create New Room
            </Button>
          </div>
        </Card>
      )}
      <RoomPreviewModal
        room={selectedRoom}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onJoin={handleJoinRoom}
      />

      <RoomCreationModal
        isOpen={showCreation}
        onClose={() => setShowCreation(false)}
        onCreateRoom={handleRoomCreated}
      />
    </div>
  )
}
