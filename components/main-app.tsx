"use client"

import { useState } from "react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { RoomsView } from "@/components/rooms-view"
import { ActiveRoomView } from "@/components/active-room-view"
import { ProfileView } from "@/components/profile-view"
import { SettingsView } from "@/components/settings-view"
import { TopBar } from "@/components/top-bar"
import { useVoice } from "@/components/voice-provider"
import { NFTMarketplace } from "@/components/nft-marketplace"

interface MainAppProps {
  user: any
  onLogout: () => void
}

export function MainApp({ user, onLogout }: MainAppProps) {
  const [activeTab, setActiveTab] = useState("rooms")
  const { currentRoom } = useVoice()

  const renderActiveView = () => {
    if (currentRoom) {
      return <ActiveRoomView user={user} />
    }

    switch (activeTab) {
      case "rooms":
        return <RoomsView user={user} />
      case "nfts":
        return <NFTMarketplace user={user} />
      case "profile":
        return <ProfileView user={user} />
      case "settings":
        return <SettingsView user={user} onLogout={onLogout} />
      default:
        return <RoomsView user={user} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <TopBar user={user} />
      <main className="flex-1 pb-16 overflow-hidden">{renderActiveView()}</main>
      {!currentRoom && <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />}
    </div>
  )
}
