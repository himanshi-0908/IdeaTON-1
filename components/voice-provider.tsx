"use client"

import type React from "react"
import { createContext, useContext, useState, useRef, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface VoiceContextType {
  // Audio states
  isConnected: boolean
  isMuted: boolean
  isDeafened: boolean
  isSpeaking: boolean
  audioLevel: number

  // Room states
  currentRoom: any
  participants: any[]
  speakers: any[]
  listeners: any[]

  // Permissions
  canSpeak: boolean
  isHost: boolean
  isModerator: boolean

  // Actions
  joinRoom: (roomId: string) => Promise<void>
  leaveRoom: () => void
  toggleMute: () => void
  toggleDeafen: () => void
  requestToSpeak: () => void
  inviteToSpeak: (userId: string) => void
  removeFromStage: (userId: string) => void
  startRecording: () => void
  stopRecording: () => void

  // WebRTC functions
  initializeAudio: () => Promise<void>
  connectToPeer: (peerId: string) => void
  disconnectFromPeer: (peerId: string) => void

  // Advanced features
  voiceEffects: string[]
  activeEffect: string | null
  isTranscribing: boolean
  isTranslating: boolean
  targetLanguage: string
  roomTheme: string
  spatialAudio: boolean

  // NFT and Tipping
  roomNFTs: any[]
  voiceNFTs: any[]
  tipHistory: any[]

  // Actions
  applyVoiceEffect: (effect: string) => void
  toggleTranscription: () => void
  toggleTranslation: () => void
  setTargetLanguage: (lang: string) => void
  changeRoomTheme: (theme: string) => void
  toggleSpatialAudio: () => void
  tipSpeaker: (speakerId: string, amount: number) => void
  mintVoiceNFT: (audioData: Blob) => void
  purchaseRoomNFT: (roomId: string) => void
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined)

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isDeafened, setIsDeafened] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [currentRoom, setCurrentRoom] = useState(null)
  const [participants, setParticipants] = useState([])
  const [speakers, setSpeakers] = useState([])
  const [listeners, setListeners] = useState([])
  const [canSpeak, setCanSpeak] = useState(false)
  const [isHost, setIsHost] = useState(false)
  const [isModerator, setIsModerator] = useState(false)

  const localStreamRef = useRef<MediaStream | null>(null)
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map())
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>()

  const { toast } = useToast()

  const [voiceEffects] = useState(["normal", "robot", "echo", "deep", "chipmunk", "reverb"])
  const [activeEffect, setActiveEffect] = useState<string | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [targetLanguage, setTargetLanguage] = useState("en")
  const [roomTheme, setRoomTheme] = useState("default")
  const [spatialAudio, setSpatialAudio] = useState(false)
  const [roomNFTs, setRoomNFTs] = useState([])
  const [voiceNFTs, setVoiceNFTs] = useState([])
  const [tipHistory, setTipHistory] = useState([])

  const applyVoiceEffect = useCallback(
    (effect: string) => {
      setActiveEffect(effect)
      toast({
        title: "Voice Effect Applied",
        description: `${effect} effect is now active`,
      })
    },
    [toast],
  )

  const toggleTranscription = useCallback(() => {
    const wasTranscribing = isTranscribing
    setIsTranscribing((prev) => !prev)
    toast({
      title: wasTranscribing ? "Transcription Disabled" : "Transcription Enabled",
      description: wasTranscribing ? "Voice-to-text stopped" : "Converting speech to text",
    })
  }, [isTranscribing, toast])

  const toggleTranslation = useCallback(() => {
    const wasTranslating = isTranslating
    setIsTranslating((prev) => !prev)
    toast({
      title: wasTranslating ? "Translation Disabled" : "Translation Enabled",
      description: wasTranslating ? "Real-time translation stopped" : "Translating speech in real-time",
    })
  }, [isTranslating, toast])

  const changeRoomTheme = useCallback(
    (theme: string) => {
      setRoomTheme(theme)
      toast({
        title: "Room Theme Changed",
        description: `Switched to ${theme} theme`,
      })
    },
    [toast],
  )

  const toggleSpatialAudio = useCallback(() => {
    const wasSpatialAudio = spatialAudio
    setSpatialAudio((prev) => !prev)
    toast({
      title: wasSpatialAudio ? "Spatial Audio Disabled" : "Spatial Audio Enabled",
      description: wasSpatialAudio ? "Switched to stereo audio" : "3D positional audio enabled",
    })
  }, [spatialAudio, toast])

  const tipSpeaker = useCallback(
    (speakerId: string, amount: number) => {
      const tip = {
        id: Date.now(),
        speakerId,
        amount,
        timestamp: new Date().toISOString(),
        txHash: `0x${Math.random().toString(16).substr(2, 8)}`,
      }

      setTipHistory((prev) => [tip, ...prev])
      toast({
        title: "Tip Sent! 🎉",
        description: `${amount} TON sent to speaker`,
      })
    },
    [toast],
  )

  const mintVoiceNFT = useCallback(
    (audioData: Blob) => {
      const nft = {
        id: Date.now(),
        name: `Voice Moment #${Date.now()}`,
        description: "Unique voice recording from DecentVoice",
        audioUrl: URL.createObjectURL(audioData),
        mintedAt: new Date().toISOString(),
        price: Math.random() * 10 + 1,
      }

      setVoiceNFTs((prev) => [nft, ...prev])
      toast({
        title: "Voice NFT Minted! 🎨",
        description: "Your voice moment is now a collectible NFT",
      })
    },
    [toast],
  )

  const purchaseRoomNFT = useCallback(
    (roomId: string) => {
      toast({
        title: "Room NFT Purchased! 🏠",
        description: "You now have exclusive access to this premium room",
      })
    },
    [toast],
  )

  const initializeAudio = useCallback(async () => {
    // Logic to initialize audio would go here
    console.log("Initializing audio")
  }, [])

  const joinRoom = useCallback(
    async (roomId: string) => {
      setIsConnected(false)

      // Simulate room joining process
      const room = {
        id: roomId,
        name: `Voice Room ${roomId}`,
        description: "Decentralized voice chat room",
        participants: Math.floor(Math.random() * 50) + 10,
        isRecording: false,
        recordingVotes: { for: 0, against: 0 },
        theme: "default",
        hasNFTAccess: false,
        premiumFeatures: [],
      }

      setCurrentRoom(room)

      // Simulate participants with more realistic data
      const mockParticipants = [
        {
          id: "1",
          username: "alice_crypto",
          avatar: "/placeholder.svg",
          isSpeaking: false,
          isMuted: false,
          role: "host",
          reputation: 95,
          isVerified: true,
          joinedAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "2",
          username: "bob_builder",
          avatar: "/placeholder.svg",
          isSpeaking: true,
          isMuted: false,
          role: "speaker",
          reputation: 87,
          isVerified: false,
          joinedAt: new Date(Date.now() - 1800000).toISOString(),
        },
        {
          id: "3",
          username: "crypto_dev",
          avatar: "/placeholder.svg",
          isSpeaking: false,
          isMuted: true,
          role: "listener",
          reputation: 72,
          isVerified: true,
          joinedAt: new Date(Date.now() - 900000).toISOString(),
        },
      ]

      setParticipants(mockParticipants)
      setSpeakers(mockParticipants.filter((p) => p.role === "host" || p.role === "speaker"))
      setListeners(mockParticipants.filter((p) => p.role === "listener"))

      await initializeAudio()
      setIsConnected(true)

      toast({
        title: "Joined Room! 🎉",
        description: `Connected to ${room.name}`,
      })
    },
    [initializeAudio, toast],
  )

  const leaveRoom = useCallback(() => {
    // Logic to leave a room would go here
    console.log("Leaving room")
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
    console.log(`Mute toggled: ${!isMuted}`)
  }, [])

  const toggleDeafen = useCallback(() => {
    setIsDeafened((prev) => !prev)
    console.log(`Deafen toggled: ${!isDeafened}`)
  }, [])

  const requestToSpeak = useCallback(() => {
    // Logic to request to speak would go here
    console.log("Requesting to speak")
  }, [])

  const inviteToSpeak = useCallback((userId: string) => {
    // Logic to invite a user to speak would go here
    console.log(`Inviting user ${userId} to speak`)
  }, [])

  const removeFromStage = useCallback((userId: string) => {
    // Logic to remove a user from stage would go here
    console.log(`Removing user ${userId} from stage`)
  }, [])

  const startRecording = useCallback(() => {
    // Logic to start recording would go here
    console.log("Starting recording")
  }, [])

  const stopRecording = useCallback(() => {
    // Logic to stop recording would go here
    console.log("Stopping recording")
  }, [])

  const connectToPeer = useCallback((peerId: string) => {
    // WebRTC peer connection setup would go here
    console.log(`Connecting to peer: ${peerId}`)
  }, [])

  const disconnectFromPeer = useCallback((peerId: string) => {
    const pc = peerConnectionsRef.current.get(peerId)
    if (pc) {
      pc.close()
      peerConnectionsRef.current.delete(peerId)
    }
  }, [])

  return (
    <VoiceContext.Provider
      value={{
        isConnected,
        isMuted,
        isDeafened,
        isSpeaking,
        audioLevel,
        currentRoom,
        participants,
        speakers,
        listeners,
        canSpeak,
        isHost,
        isModerator,
        joinRoom,
        leaveRoom,
        toggleMute,
        toggleDeafen,
        requestToSpeak,
        inviteToSpeak,
        removeFromStage,
        startRecording,
        stopRecording,
        initializeAudio,
        connectToPeer,
        disconnectFromPeer,
        voiceEffects,
        activeEffect,
        isTranscribing,
        isTranslating,
        targetLanguage,
        roomTheme,
        spatialAudio,
        roomNFTs,
        voiceNFTs,
        tipHistory,
        applyVoiceEffect,
        toggleTranscription,
        toggleTranslation,
        setTargetLanguage,
        changeRoomTheme,
        toggleSpatialAudio,
        tipSpeaker,
        mintVoiceNFT,
        purchaseRoomNFT,
      }}
    >
      {children}
    </VoiceContext.Provider>
  )
}

export function useVoice() {
  const context = useContext(VoiceContext)
  if (context === undefined) {
    throw new Error("useVoice must be used within a VoiceProvider")
  }
  return context
}
