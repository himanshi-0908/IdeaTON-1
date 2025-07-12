"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Hand,
  UserPlus,
  UserMinus,
  Phone,
  Settings,
  Users,
  Play,
  Square,
  Vote,
} from "lucide-react"
import { useVoice } from "@/components/voice-provider"
import { useAccessibility } from "@/components/accessibility-provider"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TippingPanel } from "@/components/tipping-panel"
import { VoiceEffectsPanel } from "@/components/voice-effects-panel"
import { Coins, Palette, Wand2, Crown } from "lucide-react"

interface ActiveRoomViewProps {
  user: any
}

export function ActiveRoomView({ user }: ActiveRoomViewProps) {
  const [recordingVote, setRecordingVote] = useState({ for: 0, against: 0, hasVoted: false })
  const [showVoting, setShowVoting] = useState(false)

  const {
    currentRoom,
    isMuted,
    isDeafened,
    isSpeaking,
    audioLevel,
    speakers,
    listeners,
    canSpeak,
    isHost,
    isModerator,
    leaveRoom,
    toggleMute,
    toggleDeafen,
    requestToSpeak,
    inviteToSpeak,
    removeFromStage,
    startRecording,
    stopRecording,
  } = useVoice()

  const { speak } = useAccessibility()
  const { toast } = useToast()

  useEffect(() => {
    if (currentRoom) {
      speak(`Joined ${currentRoom.name}. You are currently ${canSpeak ? "a speaker" : "listening"}.`)
    }
  }, [currentRoom, canSpeak])

  const handleLeaveRoom = () => {
    speak("Leaving voice room")
    leaveRoom()
  }

  const handleToggleMute = () => {
    toggleMute()
    speak(isMuted ? "Microphone unmuted" : "Microphone muted")
  }

  const handleToggleDeafen = () => {
    toggleDeafen()
    speak(isDeafened ? "Audio enabled" : "Audio disabled")
  }

  const handleRequestToSpeak = () => {
    requestToSpeak()
    speak("Request to speak sent to moderators")
  }

  const handleRecordingVote = (support: boolean) => {
    if (recordingVote.hasVoted) return

    setRecordingVote((prev) => ({
      for: support ? prev.for + 1 : prev.for,
      against: !support ? prev.against + 1 : prev.against,
      hasVoted: true,
    }))

    speak(`Voted ${support ? "for" : "against"} recording`)
    toast({
      title: "Vote Recorded",
      description: `Your vote ${support ? "for" : "against"} recording has been submitted`,
    })
  }

  const handleStartRecordingVote = () => {
    setShowVoting(true)
    speak("Recording vote initiated. Community members can now vote.")
    toast({
      title: "Recording Vote Started",
      description: "Community members can now vote on recording this session",
    })
  }

  if (!currentRoom) return null

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Room Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <div>
              <h1 className="text-xl font-bold">{currentRoom.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {speakers.length} speakers • {listeners.length} listeners
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentRoom.isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-1" />
                REC
              </Badge>
            )}
            <Button onClick={handleLeaveRoom} variant="destructive" size="sm" aria-label="Leave voice room">
              <Phone className="h-4 w-4 mr-2" />
              Leave
            </Button>
          </div>
        </div>
      </div>

      {/* Recording Vote Banner */}
      {showVoting && (
        <Card className="m-4 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-orange-800 dark:text-orange-200">Recording Vote in Progress</h3>
                <p className="text-sm text-orange-600 dark:text-orange-300">
                  Community is voting on whether to record this session
                </p>
              </div>
              {!recordingVote.hasVoted && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleRecordingVote(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    For ({recordingVote.for})
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleRecordingVote(false)}>
                    Against ({recordingVote.against})
                  </Button>
                </div>
              )}
            </div>
            {recordingVote.hasVoted && (
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>For: {recordingVote.for}</span>
                  <span>Against: {recordingVote.against}</span>
                </div>
                <Progress
                  value={(recordingVote.for / (recordingVote.for + recordingVote.against)) * 100}
                  className="h-2"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Speakers Stage */}
        <div className="flex-1 p-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Speakers ({speakers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {speakers.map((speaker) => (
                  <div
                    key={speaker.id}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      speaker.isSpeaking
                        ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="text-center space-y-2">
                      <div className="relative">
                        <Avatar className="h-16 w-16 mx-auto">
                          <AvatarImage src={speaker.avatar || "/placeholder.svg"} alt={speaker.username} />
                          <AvatarFallback>{speaker.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {speaker.isSpeaking && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                          </div>
                        )}
                        {speaker.isMuted && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <MicOff className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{speaker.username}</p>
                        {speaker.role === "host" && (
                          <Badge variant="default" className="text-xs">
                            Host
                          </Badge>
                        )}
                        {speaker.role === "moderator" && (
                          <Badge variant="secondary" className="text-xs">
                            Mod
                          </Badge>
                        )}
                      </div>
                      {(isHost || isModerator) && speaker.id !== user.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromStage(speaker.id)}
                          className="text-xs"
                        >
                          <UserMinus className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Listeners Sidebar */}
        <div className="w-96 p-4 border-l border-gray-200 dark:border-gray-700">
          <Tabs defaultValue="listeners" className="h-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="listeners" className="text-xs">
                <Users className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="tips" className="text-xs">
                <Coins className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="nfts" className="text-xs">
                <Palette className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="effects" className="text-xs">
                <Wand2 className="h-3 w-3" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="listeners" className="mt-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    Listeners ({listeners.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 overflow-y-auto">
                  {listeners.map((listener) => (
                    <div
                      key={listener.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={listener.avatar || "/placeholder.svg"} alt={listener.username} />
                          <AvatarFallback>{listener.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{listener.username}</span>
                      </div>
                      {(isHost || isModerator) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => inviteToSpeak(listener.id)}
                          aria-label={`Invite ${listener.username} to speak`}
                        >
                          <UserPlus className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips" className="mt-4">
              <TippingPanel speakers={speakers} user={user} />
            </TabsContent>

            <TabsContent value="nfts" className="mt-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Palette className="h-4 w-4" />
                    Room NFTs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button size="sm" className="w-full bg-transparent" variant="outline">
                    <Mic className="h-4 w-4 mr-2" />
                    Mint Voice Moment
                  </Button>
                  <Button size="sm" className="w-full bg-transparent" variant="outline">
                    <Crown className="h-4 w-4 mr-2" />
                    Create Room NFT
                  </Button>
                  <div className="text-center py-4">
                    <p className="text-xs text-gray-500">
                      Capture special moments as NFTs or create exclusive room access tokens
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="effects" className="mt-4 overflow-y-auto">
              <VoiceEffectsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          {/* Audio Level Indicator */}
          <div className="flex items-center gap-3">
            <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-100 ${isSpeaking ? "bg-green-500" : "bg-gray-400"}`}
                style={{ width: `${audioLevel * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{isSpeaking ? "Speaking" : "Silent"}</span>
          </div>

          {/* Main Controls */}
          <div className="flex items-center gap-3">
            {canSpeak ? (
              <>
                <Button
                  onClick={handleToggleMute}
                  variant={isMuted ? "destructive" : "default"}
                  size="lg"
                  className="rounded-full w-12 h-12"
                  aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Button
                  onClick={handleToggleDeafen}
                  variant={isDeafened ? "destructive" : "outline"}
                  size="lg"
                  className="rounded-full w-12 h-12"
                  aria-label={isDeafened ? "Enable audio" : "Disable audio"}
                >
                  {isDeafened ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
              </>
            ) : (
              <Button
                onClick={handleRequestToSpeak}
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
                aria-label="Request permission to speak"
              >
                <Hand className="h-4 w-4" />
                Request to Speak
              </Button>
            )}

            {(isHost || isModerator) && (
              <>
                <Button
                  onClick={handleStartRecordingVote}
                  variant="outline"
                  size="sm"
                  disabled={showVoting}
                  aria-label="Start recording vote"
                >
                  <Vote className="h-4 w-4 mr-2" />
                  Vote to Record
                </Button>
                {currentRoom.isRecording ? (
                  <Button onClick={stopRecording} variant="destructive" size="sm" aria-label="Stop recording">
                    <Square className="h-4 w-4 mr-2" />
                    Stop Recording
                  </Button>
                ) : (
                  <Button onClick={startRecording} variant="default" size="sm" aria-label="Start recording">
                    <Play className="h-4 w-4 mr-2" />
                    Start Recording
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Settings */}
          <Button variant="ghost" size="sm" aria-label="Room settings">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
