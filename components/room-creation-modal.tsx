"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Mic, Lock, Users, Palette, Zap, Crown, Coins, Plus, X } from "lucide-react"
import { useAccessibility } from "@/components/accessibility-provider"
import { useToast } from "@/hooks/use-toast"

interface RoomCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateRoom: (roomData: any) => void
}

export function RoomCreationModal({ isOpen, onClose, onCreateRoom }: RoomCreationModalProps) {
  const [step, setStep] = useState(1)
  const [isCreating, setIsCreating] = useState(false)
  const [roomData, setRoomData] = useState({
    name: "",
    description: "",
    category: "",
    tags: [] as string[],
    isPrivate: false,
    maxParticipants: [50],
    requiresNFT: false,
    nftPrice: [1],
    theme: "default",
    voiceEffects: true,
    recordingAllowed: true,
    tippingEnabled: true,
    moderationLevel: "medium",
    welcomeMessage: "",
  })
  const [newTag, setNewTag] = useState("")

  const { speak } = useAccessibility()
  const { toast } = useToast()

  const categories = [
    { id: "crypto", name: "Cryptocurrency", icon: "₿" },
    { id: "nft", name: "NFT & Art", icon: "🎨" },
    { id: "tech", name: "Technology", icon: "💻" },
    { id: "gaming", name: "Gaming", icon: "🎮" },
    { id: "music", name: "Music", icon: "🎵" },
    { id: "business", name: "Business", icon: "💼" },
    { id: "education", name: "Education", icon: "📚" },
    { id: "social", name: "Social", icon: "💬" },
  ]

  const themes = [
    { id: "default", name: "Default", preview: "bg-gray-500" },
    { id: "neon", name: "Neon City", preview: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { id: "forest", name: "Forest", preview: "bg-gradient-to-r from-green-400 to-emerald-500" },
    { id: "ocean", name: "Ocean", preview: "bg-gradient-to-r from-blue-400 to-cyan-500" },
    { id: "space", name: "Space", preview: "bg-gradient-to-r from-indigo-500 to-purple-600" },
    { id: "sunset", name: "Sunset", preview: "bg-gradient-to-r from-orange-400 to-red-500" },
  ]

  const addTag = () => {
    if (newTag.trim() && !roomData.tags.includes(newTag.trim())) {
      setRoomData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setRoomData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleCreateRoom = async () => {
    setIsCreating(true)
    speak("Creating your voice room")

    // Simulate room creation
    setTimeout(() => {
      const newRoom = {
        id: Date.now().toString(),
        ...roomData,
        host: { username: "current_user", avatar: "/placeholder.svg" },
        participants: 1,
        speakers: 1,
        isLive: true,
        startTime: "now",
        verified: false,
      }

      onCreateRoom(newRoom)
      setIsCreating(false)
      onClose()

      toast({
        title: "Room Created! 🎉",
        description: `${roomData.name} is now live and ready for participants`,
      })
    }, 3000)
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Mic className="h-6 w-6 text-purple-600" />
            Create Voice Room
            <Badge variant="outline">Step {step} of 3</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Basic Information</h3>
                <p className="text-gray-600 dark:text-gray-400">Set up your room's basic details</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="room-name">Room Name *</Label>
                  <Input
                    id="room-name"
                    placeholder="Enter an engaging room name..."
                    value={roomData.name}
                    onChange={(e) => setRoomData((prev) => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="room-description">Description</Label>
                  <Textarea
                    id="room-description"
                    placeholder="Describe what your room is about..."
                    value={roomData.description}
                    onChange={(e) => setRoomData((prev) => ({ ...prev, description: e.target.value }))}
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {categories.map((category) => (
                      <Card
                        key={category.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          roomData.category === category.id
                            ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20"
                            : ""
                        }`}
                        onClick={() => setRoomData((prev) => ({ ...prev, category: category.id }))}
                      >
                        <CardContent className="p-3 text-center">
                          <div className="text-2xl mb-1">{category.icon}</div>
                          <div className="text-sm font-medium">{category.name}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                      className="flex-1"
                    />
                    <Button onClick={addTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {roomData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        #{tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Room Settings</h3>
                <p className="text-gray-600 dark:text-gray-400">Configure privacy and access controls</p>
              </div>

              <Tabs defaultValue="access" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="access">Access</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="moderation">Moderation</TabsTrigger>
                </TabsList>

                <TabsContent value="access" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Private Room</p>
                          <p className="text-sm text-gray-500">Only invited users can join</p>
                        </div>
                      </div>
                      <Switch
                        checked={roomData.isPrivate}
                        onCheckedChange={(checked) => setRoomData((prev) => ({ ...prev, isPrivate: checked }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Maximum Participants</Label>
                      <Slider
                        value={roomData.maxParticipants}
                        onValueChange={(value) => setRoomData((prev) => ({ ...prev, maxParticipants: value }))}
                        max={500}
                        min={10}
                        step={10}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>10</span>
                        <span className="font-medium">{roomData.maxParticipants[0]} participants</span>
                        <span>500</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Crown className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="font-medium">NFT Gate</p>
                          <p className="text-sm text-gray-500">Require NFT ownership to join</p>
                        </div>
                      </div>
                      <Switch
                        checked={roomData.requiresNFT}
                        onCheckedChange={(checked) => setRoomData((prev) => ({ ...prev, requiresNFT: checked }))}
                      />
                    </div>

                    {roomData.requiresNFT && (
                      <div className="space-y-2 pl-8">
                        <Label>NFT Price (TON)</Label>
                        <Slider
                          value={roomData.nftPrice}
                          onValueChange={(value) => setRoomData((prev) => ({ ...prev, nftPrice: value }))}
                          max={100}
                          min={0.1}
                          step={0.1}
                          className="mt-2"
                        />
                        <div className="text-sm text-gray-500">Price: {roomData.nftPrice[0]} TON</div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="features" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Palette className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="font-medium">Voice Effects</p>
                          <p className="text-sm text-gray-500">Allow voice modulation effects</p>
                        </div>
                      </div>
                      <Switch
                        checked={roomData.voiceEffects}
                        onCheckedChange={(checked) => setRoomData((prev) => ({ ...prev, voiceEffects: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Coins className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="font-medium">TON Tipping</p>
                          <p className="text-sm text-gray-500">Enable cryptocurrency tipping</p>
                        </div>
                      </div>
                      <Switch
                        checked={roomData.tippingEnabled}
                        onCheckedChange={(checked) => setRoomData((prev) => ({ ...prev, tippingEnabled: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mic className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="font-medium">Recording Allowed</p>
                          <p className="text-sm text-gray-500">Allow DAO voting for recording</p>
                        </div>
                      </div>
                      <Switch
                        checked={roomData.recordingAllowed}
                        onCheckedChange={(checked) => setRoomData((prev) => ({ ...prev, recordingAllowed: checked }))}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="moderation" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Moderation Level</Label>
                      <Select
                        value={roomData.moderationLevel}
                        onValueChange={(value) => setRoomData((prev) => ({ ...prev, moderationLevel: value }))}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - Minimal moderation</SelectItem>
                          <SelectItem value="medium">Medium - Balanced approach</SelectItem>
                          <SelectItem value="high">High - Strict moderation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Welcome Message</Label>
                      <Textarea
                        placeholder="Welcome message for new participants..."
                        value={roomData.welcomeMessage}
                        onChange={(e) => setRoomData((prev) => ({ ...prev, welcomeMessage: e.target.value }))}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Customize Appearance</h3>
                <p className="text-gray-600 dark:text-gray-400">Choose your room's visual theme</p>
              </div>

              <div>
                <Label>Room Theme</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                  {themes.map((theme) => (
                    <Card
                      key={theme.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        roomData.theme === theme.id ? "ring-2 ring-purple-500" : ""
                      }`}
                      onClick={() => setRoomData((prev) => ({ ...prev, theme: theme.id }))}
                    >
                      <CardContent className="p-4 text-center">
                        <div className={`w-full h-16 rounded-lg mb-3 ${theme.preview}`} />
                        <p className="font-medium">{theme.name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Room Preview */}
              <Card className="border-2 border-dashed border-purple-300">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto flex items-center justify-center">
                      <Mic className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">{roomData.name || "Your Room Name"}</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {roomData.description || "Your room description will appear here"}
                      </p>
                    </div>
                    <div className="flex justify-center gap-2">
                      {roomData.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Max {roomData.maxParticipants[0]}
                      </span>
                      {roomData.isPrivate && (
                        <span className="flex items-center gap-1">
                          <Lock className="h-4 w-4" />
                          Private
                        </span>
                      )}
                      {roomData.requiresNFT && (
                        <span className="flex items-center gap-1">
                          <Crown className="h-4 w-4" />
                          NFT Gated
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={step === 1 ? onClose : prevStep} disabled={isCreating}>
              {step === 1 ? "Cancel" : "Previous"}
            </Button>

            <div className="flex gap-2">
              {step < 3 ? (
                <Button
                  onClick={nextStep}
                  disabled={!roomData.name || !roomData.category}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={handleCreateRoom}
                  disabled={isCreating || !roomData.name}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {isCreating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Room...
                    </div>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Create Room
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
