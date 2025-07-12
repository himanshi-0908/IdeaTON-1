"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Lock, Send, Plus } from "lucide-react"
import { useAccessibility } from "@/components/accessibility-provider"

interface MessagesViewProps {
  user: any
}

export function MessagesView({ user }: MessagesViewProps) {
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const { speak } = useAccessibility()

  useEffect(() => {
    // Load sample conversations
    const sampleConversations = [
      {
        id: 1,
        name: "Alice Crypto",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "Hey! Love your latest post about NFTs",
        timestamp: "2m ago",
        unread: 2,
        encrypted: true,
      },
      {
        id: 2,
        name: "Bob Builder",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "The DAO voting feature is amazing!",
        timestamp: "1h ago",
        unread: 0,
        encrypted: true,
      },
      {
        id: 3,
        name: "Crypto Artists Group",
        avatar: "/placeholder.svg?height=40&width=40",
        lastMessage: "New artwork shared by @crypto_artist",
        timestamp: "3h ago",
        unread: 5,
        encrypted: true,
        isGroup: true,
      },
    ]
    setConversations(sampleConversations)
  }, [])

  useEffect(() => {
    if (selectedChat) {
      // Load messages for selected chat
      const sampleMessages = [
        {
          id: 1,
          sender: selectedChat.name,
          content: "Hey! How are you doing?",
          timestamp: "10:30 AM",
          isOwn: false,
        },
        {
          id: 2,
          sender: user.username,
          content: "Great! Just exploring TONnect features",
          timestamp: "10:32 AM",
          isOwn: true,
        },
        {
          id: 3,
          sender: selectedChat.name,
          content: "The encryption is so smooth here!",
          timestamp: "10:35 AM",
          isOwn: false,
        },
      ]
      setMessages(sampleMessages)
    }
  }, [selectedChat, user.username])

  const handleSelectChat = (conversation: any) => {
    setSelectedChat(conversation)
    speak(`Opened chat with ${conversation.name}`)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return

    const message = {
      id: Date.now(),
      sender: user.username,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    }

    setMessages([...messages, message])
    setNewMessage("")
    speak("Message sent")
  }

  if (!selectedChat) {
    return (
      <div className="h-full p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Messages</h2>
            <Button size="sm" aria-label="Start new conversation">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search conversations..." className="pl-10" aria-label="Search conversations" />
          </div>

          <div className="space-y-2">
            {conversations.map((conversation) => (
              <Card
                key={conversation.id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={() => handleSelectChat(conversation)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={conversation.avatar || "/placeholder.svg"}
                        alt={`${conversation.name} avatar`}
                      />
                      <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{conversation.name}</p>
                        {conversation.encrypted && <Lock className="h-3 w-3 text-green-500" />}
                        {conversation.isGroup && (
                          <Badge variant="secondary" className="text-xs">
                            Group
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-1">{conversation.timestamp}</p>
                      {conversation.unread > 0 && (
                        <Badge variant="default" className="text-xs">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost" onClick={() => setSelectedChat(null)} aria-label="Back to conversations">
            ←
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage src={selectedChat.avatar || "/placeholder.svg"} alt={`${selectedChat.name} avatar`} />
            <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium">{selectedChat.name}</p>
              <Lock className="h-4 w-4 text-green-500" />
              <Badge variant="secondary" className="text-xs">
                E2E Encrypted
              </Badge>
            </div>
            <p className="text-sm text-gray-500">{selectedChat.isGroup ? "Group Chat" : "Online"}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isOwn
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>{message.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type your encrypted message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
            aria-label="Type message"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()} aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <Lock className="h-3 w-3" />
          Messages are end-to-end encrypted and stored on IPFS
        </p>
      </div>
    </div>
  )
}
