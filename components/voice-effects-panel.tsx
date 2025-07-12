"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wand2, Volume2, Globe, Type, Palette, Sparkles } from "lucide-react"
import { useVoice } from "@/components/voice-provider"
import { useAccessibility } from "@/components/accessibility-provider"

export function VoiceEffectsPanel() {
  const [effectIntensity, setEffectIntensity] = useState([50])
  const [customSettings, setCustomSettings] = useState({
    pitch: [0],
    speed: [100],
    reverb: [0],
    echo: [0],
  })

  const {
    voiceEffects,
    activeEffect,
    isTranscribing,
    isTranslating,
    targetLanguage,
    roomTheme,
    spatialAudio,
    applyVoiceEffect,
    toggleTranscription,
    toggleTranslation,
    setTargetLanguage,
    changeRoomTheme,
    toggleSpatialAudio,
  } = useVoice()

  const { speak } = useAccessibility()

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "ru", name: "Russian" },
  ]

  const themes = [
    { id: "default", name: "Default", color: "bg-gray-500" },
    { id: "neon", name: "Neon City", color: "bg-purple-500" },
    { id: "forest", name: "Forest", color: "bg-green-500" },
    { id: "ocean", name: "Ocean", color: "bg-blue-500" },
    { id: "space", name: "Space", color: "bg-indigo-500" },
    { id: "sunset", name: "Sunset", color: "bg-orange-500" },
  ]

  const handleEffectChange = (effect: string) => {
    applyVoiceEffect(effect)
    speak(`Applied ${effect} voice effect`)
  }

  const handleLanguageChange = (langCode: string) => {
    setTargetLanguage(langCode)
    const language = languages.find((l) => l.code === langCode)
    speak(`Translation language set to ${language?.name}`)
  }

  const handleThemeChange = (themeId: string) => {
    changeRoomTheme(themeId)
    const theme = themes.find((t) => t.id === themeId)
    speak(`Room theme changed to ${theme?.name}`)
  }

  return (
    <div className="space-y-6">
      {/* Voice Effects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-purple-500" />
            Voice Effects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {voiceEffects.map((effect) => (
              <Button
                key={effect}
                variant={activeEffect === effect ? "default" : "outline"}
                size="sm"
                onClick={() => handleEffectChange(effect)}
                className="capitalize"
              >
                {effect === "normal" && "🎤"}
                {effect === "robot" && "🤖"}
                {effect === "echo" && "🔊"}
                {effect === "deep" && "🎭"}
                {effect === "chipmunk" && "🐿️"}
                {effect === "reverb" && "🏛️"}
                <span className="ml-1">{effect}</span>
              </Button>
            ))}
          </div>

          {activeEffect && activeEffect !== "normal" && (
            <div className="space-y-3 pt-3 border-t">
              <div>
                <label className="text-sm font-medium">Effect Intensity</label>
                <Slider
                  value={effectIntensity}
                  onValueChange={setEffectIntensity}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Pitch</label>
                  <Slider
                    value={customSettings.pitch}
                    onValueChange={(value) => setCustomSettings((prev) => ({ ...prev, pitch: value }))}
                    min={-50}
                    max={50}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Speed</label>
                  <Slider
                    value={customSettings.speed}
                    onValueChange={(value) => setCustomSettings((prev) => ({ ...prev, speed: value }))}
                    min={50}
                    max={200}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            AI Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <div>
                <p className="font-medium">Live Transcription</p>
                <p className="text-sm text-gray-500">Convert speech to text in real-time</p>
              </div>
            </div>
            <Switch checked={isTranscribing} onCheckedChange={toggleTranscription} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <div>
                <p className="font-medium">Real-time Translation</p>
                <p className="text-sm text-gray-500">Translate speech to other languages</p>
              </div>
            </div>
            <Switch checked={isTranslating} onCheckedChange={toggleTranslation} />
          </div>

          {isTranslating && (
            <div className="pl-6 space-y-2">
              <label className="text-sm font-medium">Target Language</label>
              <Select value={targetLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <div>
                <p className="font-medium">Spatial Audio</p>
                <p className="text-sm text-gray-500">3D positional audio experience</p>
              </div>
            </div>
            <Switch checked={spatialAudio} onCheckedChange={toggleSpatialAudio} />
          </div>
        </CardContent>
      </Card>

      {/* Room Themes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-pink-500" />
            Room Themes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {themes.map((theme) => (
              <Button
                key={theme.id}
                variant={roomTheme === theme.id ? "default" : "outline"}
                onClick={() => handleThemeChange(theme.id)}
                className="flex items-center gap-2 h-auto p-3"
              >
                <div className={`w-4 h-4 rounded-full ${theme.color}`} />
                <span className="text-sm">{theme.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Features Summary */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3">🎯 Active Features</h4>
          <div className="flex flex-wrap gap-2">
            {activeEffect && activeEffect !== "normal" && (
              <Badge variant="default" className="capitalize">
                🎭 {activeEffect} Effect
              </Badge>
            )}
            {isTranscribing && <Badge variant="secondary">📝 Live Transcription</Badge>}
            {isTranslating && (
              <Badge variant="secondary">
                🌍 Translation ({languages.find((l) => l.code === targetLanguage)?.name})
              </Badge>
            )}
            {spatialAudio && <Badge variant="secondary">🎧 Spatial Audio</Badge>}
            {roomTheme !== "default" && (
              <Badge variant="outline">🎨 {themes.find((t) => t.id === roomTheme)?.name} Theme</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
