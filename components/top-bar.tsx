"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Coins, Shield } from "lucide-react"
import { useAccessibility } from "@/components/accessibility-provider"

interface TopBarProps {
  user: any
}

export function TopBar({ user }: TopBarProps) {
  const { speak } = useAccessibility()

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={`${user.username} avatar`} />
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                DecentVoice
              </h1>
              {user.isVerified && <Shield className="h-4 w-4 text-green-500" />}
            </div>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Coins className="h-3 w-3" />
            {user.balance} TON
          </Badge>

          <Badge variant="outline" className="flex items-center gap-1">
            ⭐ {user.reputation}
          </Badge>

          <Button size="sm" variant="ghost" onClick={() => speak("Opening notifications")} aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
