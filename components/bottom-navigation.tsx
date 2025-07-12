"use client"

import { Button } from "@/components/ui/button"
import { Mic, User, Settings, Palette } from "lucide-react"
import { useAccessibility } from "@/components/accessibility-provider"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const { speak } = useAccessibility()

  const tabs = [
    { id: "rooms", label: "Rooms", icon: Mic },
    { id: "nfts", label: "NFTs", icon: Palette },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const handleTabChange = (tabId: string, label: string) => {
    onTabChange(tabId)
    speak(`Opened ${label}`)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="flex justify-around">
        {tabs.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={activeTab === id ? "default" : "ghost"}
            size="sm"
            onClick={() => handleTabChange(id, label)}
            className="flex flex-col items-center gap-1 h-auto py-2 px-6"
            aria-label={`Navigate to ${label}`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  )
}
