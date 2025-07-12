"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Mic, Shield, Trash2, LogOut, Accessibility } from "lucide-react"
import { useAccessibility } from "@/components/accessibility-provider"
import { useToast } from "@/hooks/use-toast"

interface SettingsViewProps {
  user: any
  onLogout: () => void
}

export function SettingsView({ user, onLogout }: SettingsViewProps) {
  const [audioSettings, setAudioSettings] = useState({
    inputVolume: [80],
    outputVolume: [70],
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  })

  const {
    isAccessibilityMode,
    isSpeechEnabled,
    isVoiceCommandsEnabled,
    isHighContrastMode,
    speechRate,
    fontSize,
    toggleAccessibilityMode,
    toggleSpeech,
    toggleVoiceCommands,
    toggleHighContrast,
    setSpeechRate,
    setFontSize,
    speak,
  } = useAccessibility()

  const { toast } = useToast()

  const handleLogout = () => {
    speak("Logging out of DecentVoice")
    onLogout()
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* Audio Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Audio Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="font-medium">Input Volume</p>
            <Slider
              value={audioSettings.inputVolume}
              onValueChange={(value) => setAudioSettings((prev) => ({ ...prev, inputVolume: value }))}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <p className="font-medium">Output Volume</p>
            <Slider
              value={audioSettings.outputVolume}
              onValueChange={(value) => setAudioSettings((prev) => ({ ...prev, outputVolume: value }))}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Echo Cancellation</p>
              <p className="text-sm text-gray-500">Reduce echo in voice calls</p>
            </div>
            <Switch
              checked={audioSettings.echoCancellation}
              onCheckedChange={(checked) => setAudioSettings((prev) => ({ ...prev, echoCancellation: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Noise Suppression</p>
              <p className="text-sm text-gray-500">Filter background noise</p>
            </div>
            <Switch
              checked={audioSettings.noiseSuppression}
              onCheckedChange={(checked) => setAudioSettings((prev) => ({ ...prev, noiseSuppression: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto Gain Control</p>
              <p className="text-sm text-gray-500">Automatically adjust microphone volume</p>
            </div>
            <Switch
              checked={audioSettings.autoGainControl}
              onCheckedChange={(checked) => setAudioSettings((prev) => ({ ...prev, autoGainControl: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            Accessibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Accessibility Mode</p>
              <p className="text-sm text-gray-500">Enable all accessibility features at once</p>
            </div>
            <Switch checked={isAccessibilityMode} onCheckedChange={toggleAccessibilityMode} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Text-to-Speech</p>
              <p className="text-sm text-gray-500">Read interface elements aloud</p>
            </div>
            <Switch checked={isSpeechEnabled} onCheckedChange={toggleSpeech} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Voice Commands</p>
              <p className="text-sm text-gray-500">Control app with voice</p>
            </div>
            <Switch checked={isVoiceCommandsEnabled} onCheckedChange={toggleVoiceCommands} />
          </div>

          <div className="space-y-3">
            <p className="font-medium">Speech Rate</p>
            <Slider
              value={[speechRate]}
              onValueChange={(value) => setSpeechRate(value[0])}
              max={2}
              min={0.5}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Slow</span>
              <span>Normal</span>
              <span>Fast</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">High Contrast Mode</p>
              <p className="text-sm text-gray-500">Improve visibility</p>
            </div>
            <Switch checked={isHighContrastMode} onCheckedChange={toggleHighContrast} />
          </div>

          <div className="space-y-3">
            <p className="font-medium">Font Size</p>
            <Slider
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
              max={24}
              min={12}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Small</span>
              <span>Normal</span>
              <span>Large</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-green-600" />
              <p className="font-medium text-green-800 dark:text-green-200">Your Privacy is Protected</p>
            </div>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• P2P encrypted voice streaming</li>
              <li>• No recording without DAO approval</li>
              <li>• Anonymous wallet-based identity</li>
              <li>• Decentralized room hosting</li>
            </ul>
          </div>

          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Shield className="h-4 w-4 mr-2" />
            View Privacy Policy
          </Button>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleLogout} variant="outline" className="w-full justify-start bg-transparent">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>

          <Separator />

          <Button variant="destructive" className="w-full justify-start">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>

          <p className="text-xs text-gray-500">
            Deleting your account will remove your voice chat history and reputation score permanently.
          </p>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardContent className="p-4 text-center">
          <div className="space-y-2">
            <h3 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              DecentVoice
            </h3>
            <p className="text-sm text-gray-500">Version 1.0.0</p>
            <p className="text-xs text-gray-400">
              Built on TON blockchain • P2P Voice Streaming • Made with ❤️ for Web3
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
