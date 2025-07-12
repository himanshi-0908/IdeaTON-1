"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Mic, MicOff, Eye, EyeOff, Accessibility } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AccessibilityContextType {
  // Core accessibility states
  isAccessibilityMode: boolean
  isSpeechEnabled: boolean
  isVoiceCommandsEnabled: boolean
  isHighContrastMode: boolean
  speechRate: number
  fontSize: number

  // Actions
  speak: (text: string, priority?: "low" | "medium" | "high") => void
  toggleAccessibilityMode: () => void
  toggleSpeech: () => void
  toggleVoiceCommands: () => void
  toggleHighContrast: () => void
  setSpeechRate: (rate: number) => void
  setFontSize: (size: number) => void
  setVoiceCommandCallback: (callback: (command: string) => void) => void

  // Advanced features
  announcePageChange: (pageName: string) => void
  announceNotification: (message: string) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false)
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false)
  const [isVoiceCommandsEnabled, setIsVoiceCommandsEnabled] = useState(false)
  const [isHighContrastMode, setIsHighContrastMode] = useState(false)
  const [speechRate, setSpeechRate] = useState(1)
  const [fontSize, setFontSize] = useState(16)

  const speechQueueRef = useRef<Array<{ text: string; priority: "low" | "medium" | "high" }>>([])
  const isSpeakingRef = useRef(false)
  const voiceCommandCallbackRef = useRef<((command: string) => void) | null>(null)
  const recognitionRef = useRef<any>(null)

  const { toast } = useToast()

  const speak = useCallback(
    (text: string, priority: "low" | "medium" | "high" = "medium") => {
      if (!isSpeechEnabled || !isAccessibilityMode) return

      if ("speechSynthesis" in window) {
        if (priority === "high") {
          speechSynthesis.cancel()
          speechQueueRef.current.unshift({ text, priority })
        } else {
          speechQueueRef.current.push({ text, priority })
        }

        if (!isSpeakingRef.current) {
          processNextSpeech()
        }
      }
    },
    [isSpeechEnabled, isAccessibilityMode, speechRate],
  )

  const processNextSpeech = useCallback(() => {
    if (speechQueueRef.current.length === 0) {
      isSpeakingRef.current = false
      return
    }

    isSpeakingRef.current = true
    const { text } = speechQueueRef.current.shift()!

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = speechRate
    utterance.volume = 0.8
    utterance.pitch = 1

    utterance.onend = () => {
      setTimeout(processNextSpeech, 100)
    }

    utterance.onerror = () => {
      isSpeakingRef.current = false
      processNextSpeech()
    }

    speechSynthesis.speak(utterance)
  }, [speechRate])

  const toggleAccessibilityMode = useCallback(() => {
    const newMode = !isAccessibilityMode
    setIsAccessibilityMode(newMode)

    if (newMode) {
      setIsSpeechEnabled(true)
      setIsVoiceCommandsEnabled(true)
      setIsHighContrastMode(true)
      setFontSize(18)
      speak(
        "Accessibility mode enabled for DecentVoice. Voice commands and screen reader support are now active.",
        "high",
      )

      toast({
        title: "Accessibility Mode Enabled",
        description: "All accessibility features are now active",
      })
    } else {
      speak("Accessibility mode disabled.", "high")
      setIsSpeechEnabled(false)
      setIsVoiceCommandsEnabled(false)
      setIsHighContrastMode(false)
      setFontSize(16)
    }
  }, [isAccessibilityMode])

  const toggleSpeech = useCallback(() => {
    const newState = !isSpeechEnabled
    setIsSpeechEnabled(newState)
    if (isAccessibilityMode) {
      speak(newState ? "Text-to-speech enabled." : "Text-to-speech disabled.", "high")
    }
  }, [isSpeechEnabled, isAccessibilityMode])

  const toggleVoiceCommands = useCallback(() => {
    const newState = !isVoiceCommandsEnabled
    setIsVoiceCommandsEnabled(newState)
    if (isAccessibilityMode) {
      speak(
        newState ? "Voice commands enabled. Say 'help' for available commands." : "Voice commands disabled.",
        "high",
      )
    }
  }, [isVoiceCommandsEnabled, isAccessibilityMode])

  const toggleHighContrast = useCallback(() => {
    const newState = !isHighContrastMode
    setIsHighContrastMode(newState)
    if (isAccessibilityMode) {
      speak(newState ? "High contrast mode enabled." : "High contrast mode disabled.", "medium")
    }
  }, [isHighContrastMode, isAccessibilityMode])

  const setVoiceCommandCallback = useCallback((callback: (command: string) => void) => {
    voiceCommandCallbackRef.current = callback
  }, [])

  const announcePageChange = useCallback(
    (pageName: string) => {
      speak(`Navigated to ${pageName}`, "high")
    },
    [speak],
  )

  const announceNotification = useCallback(
    (message: string) => {
      speak(`Notification: ${message}`, "high")
    },
    [speak],
  )

  // Voice commands setup
  useEffect(() => {
    if (!isVoiceCommandsEnabled || !isAccessibilityMode) {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
      return
    }

    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      const recognition = recognitionRef.current
      recognition.continuous = true
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onresult = (event: any) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase()
        console.log("Voice command detected:", command)

        if (command.includes("help")) {
          speak(
            "Available commands: Join room, leave room, mute, unmute, request to speak, toggle accessibility features.",
            "high",
          )
        } else if (command.includes("join room")) {
          speak("Looking for rooms to join", "medium")
        } else if (command.includes("leave room")) {
          speak("Leaving current room", "medium")
        } else if (command.includes("mute")) {
          speak("Microphone muted", "medium")
        } else if (command.includes("unmute")) {
          speak("Microphone unmuted", "medium")
        } else if (command.includes("request to speak")) {
          speak("Requesting permission to speak", "medium")
        } else if (voiceCommandCallbackRef.current) {
          voiceCommandCallbackRef.current(command)
        }
      }

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        if (event.error === "not-allowed") {
          speak("Microphone access denied. Please enable it in your browser settings.", "high")
          toast({
            title: "Microphone Access Denied",
            description: "Please enable microphone access for voice commands",
            variant: "destructive",
          })
        }
      }

      recognition.onend = () => {
        if (isVoiceCommandsEnabled && isAccessibilityMode && recognitionRef.current) {
          setTimeout(() => {
            if (recognitionRef.current) {
              recognitionRef.current.start()
            }
          }, 1000)
        }
      }

      recognition.start()
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
    }
  }, [isVoiceCommandsEnabled, isAccessibilityMode])

  // Apply styles
  useEffect(() => {
    if (isHighContrastMode) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }, [isHighContrastMode])

  useEffect(() => {
    document.documentElement.style.setProperty("--base-font-size", `${fontSize}px`)
  }, [fontSize])

  return (
    <AccessibilityContext.Provider
      value={{
        isAccessibilityMode,
        isSpeechEnabled,
        isVoiceCommandsEnabled,
        isHighContrastMode,
        speechRate,
        fontSize,
        speak,
        toggleAccessibilityMode,
        toggleSpeech,
        toggleVoiceCommands,
        toggleHighContrast,
        setSpeechRate,
        setFontSize,
        setVoiceCommandCallback,
        announcePageChange,
        announceNotification,
      }}
    >
      {children}

      {/* Accessibility Control Panel */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <Button
          size="sm"
          variant={isAccessibilityMode ? "default" : "outline"}
          onClick={toggleAccessibilityMode}
          aria-label={isAccessibilityMode ? "Disable accessibility mode" : "Enable accessibility mode"}
          className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Accessibility className="h-5 w-5" />
        </Button>

        {isAccessibilityMode && (
          <>
            <Button
              size="sm"
              variant={isSpeechEnabled ? "default" : "outline"}
              onClick={toggleSpeech}
              aria-label={isSpeechEnabled ? "Disable text-to-speech" : "Enable text-to-speech"}
              className="w-12 h-12 rounded-full"
            >
              {isSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>

            <Button
              size="sm"
              variant={isVoiceCommandsEnabled ? "default" : "outline"}
              onClick={toggleVoiceCommands}
              aria-label={isVoiceCommandsEnabled ? "Stop voice commands" : "Start voice commands"}
              className="w-12 h-12 rounded-full"
            >
              {isVoiceCommandsEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>

            <Button
              size="sm"
              variant={isHighContrastMode ? "default" : "outline"}
              onClick={toggleHighContrast}
              aria-label={isHighContrastMode ? "Disable high contrast" : "Enable high contrast"}
              className="w-12 h-12 rounded-full"
            >
              {isHighContrastMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </>
        )}
      </div>

      {/* Voice Commands Indicator */}
      {isAccessibilityMode && isVoiceCommandsEnabled && (
        <div className="fixed top-4 left-4 z-40 bg-purple-600 text-white p-3 rounded-lg text-sm max-w-xs">
          <p className="font-semibold mb-1">Voice Commands Active</p>
          <p className="text-xs opacity-90">Say "help" for available commands</p>
        </div>
      )}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
