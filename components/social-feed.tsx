"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Share, Coins, Send, ImageIcon, VideoIcon } from "lucide-react"
import { useAccessibility } from "@/components/accessibility-provider"
import { useToast } from "@/hooks/use-toast"

interface SocialFeedProps {
  user: any
}

export function SocialFeed({ user }: SocialFeedProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [newPost, setNewPost] = useState("")
  const { speak } = useAccessibility()
  const { toast } = useToast()

  useEffect(() => {
    // Load sample posts
    const samplePosts = [
      {
        id: 1,
        author: "alice_crypto",
        avatar: "/placeholder.svg?height=40&width=40",
        content: "Just minted my first NFT profile on TONnect! The future of social media is here 🚀",
        timestamp: "2 hours ago",
        likes: 24,
        comments: 8,
        tips: 5.2,
        liked: false,
        media: null,
      },
      {
        id: 2,
        author: "bob_builder",
        avatar: "/placeholder.svg?height=40&width=40",
        content: "Love how TONnect gives us full control over our data. No more corporate surveillance!",
        timestamp: "4 hours ago",
        likes: 18,
        comments: 12,
        tips: 3.8,
        liked: true,
        media: null,
      },
      {
        id: 3,
        author: "crypto_artist",
        avatar: "/placeholder.svg?height=40&width=40",
        content: "Check out my latest digital art piece! Available as NFT 🎨",
        timestamp: "6 hours ago",
        likes: 45,
        comments: 15,
        tips: 12.5,
        liked: false,
        media: "/placeholder.svg?height=300&width=400",
      },
    ]
    setPosts(samplePosts)
  }, [])

  const handleCreatePost = () => {
    if (!newPost.trim()) return

    const post = {
      id: Date.now(),
      author: user.username,
      avatar: user.avatar,
      content: newPost,
      timestamp: "now",
      likes: 0,
      comments: 0,
      tips: 0,
      liked: false,
      media: null,
    }

    setPosts([post, ...posts])
    setNewPost("")
    speak("Post created successfully")
    toast({
      title: "Post Created",
      description: "Your post has been added to the decentralized feed",
    })
  }

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    )
    speak("Post liked")
  }

  const handleTip = (postId: number, author: string) => {
    speak(`Sending tip to ${author}`)
    toast({
      title: "Tip Sent",
      description: `0.5 TON sent to ${author}`,
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Create Post */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={`${user.username} avatar`} />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.username}</p>
              <p className="text-sm text-gray-500">Share your thoughts...</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="What's on your mind? Your post will be stored on IPFS..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[100px] resize-none"
            aria-label="Create new post"
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" aria-label="Add image">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" aria-label="Add video">
                <VideoIcon className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Post to IPFS
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.avatar || "/placeholder.svg"} alt={`${post.author} avatar`} />
                    <AvatarFallback>{post.author[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{post.author}</p>
                    <p className="text-sm text-gray-500">{post.timestamp}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  On-Chain
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-800 dark:text-gray-200">{post.content}</p>

              {post.media && (
                <div className="rounded-lg overflow-hidden">
                  <img src={post.media || "/placeholder.svg"} alt="Post media" className="w-full h-auto" />
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <Button
                    size="sm"
                    variant={post.liked ? "default" : "ghost"}
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2"
                    aria-label={`${post.liked ? "Unlike" : "Like"} post by ${post.author}`}
                  >
                    <Heart className={`h-4 w-4 ${post.liked ? "fill-current" : ""}`} />
                    {post.likes}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex items-center gap-2"
                    aria-label={`Comment on post by ${post.author}`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    {post.comments}
                  </Button>

                  <Button size="sm" variant="ghost" aria-label={`Share post by ${post.author}`}>
                    <Share className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTip(post.id, post.author)}
                  className="flex items-center gap-2"
                  aria-label={`Tip ${post.author} with TON tokens`}
                >
                  <Coins className="h-4 w-4" />
                  Tip ({post.tips} TON)
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
