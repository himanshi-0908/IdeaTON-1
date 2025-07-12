"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Vote, Shield, Plus, ThumbsUp, ThumbsDown } from "lucide-react"
import { useAccessibility } from "@/components/accessibility-provider"
import { useToast } from "@/hooks/use-toast"

interface GroupsViewProps {
  user: any
}

export function GroupsView({ user }: GroupsViewProps) {
  const [groups, setGroups] = useState<any[]>([])
  const [activeVotes, setActiveVotes] = useState<any[]>([])
  const { speak } = useAccessibility()
  const { toast } = useToast()

  useEffect(() => {
    // Load sample groups
    const sampleGroups = [
      {
        id: 1,
        name: "TON Developers",
        description: "Building the future on TON blockchain",
        members: 1247,
        avatar: "/placeholder.svg?height=60&width=60",
        isJoined: true,
        tokenGated: true,
        requiredTokens: 100,
        category: "Development",
      },
      {
        id: 2,
        name: "Crypto Artists",
        description: "NFT creators and digital artists community",
        members: 892,
        avatar: "/placeholder.svg?height=60&width=60",
        isJoined: true,
        tokenGated: true,
        requiredTokens: 50,
        category: "Art",
      },
      {
        id: 3,
        name: "DeFi Enthusiasts",
        description: "Discussing DeFi protocols and strategies",
        members: 2156,
        avatar: "/placeholder.svg?height=60&width=60",
        isJoined: false,
        tokenGated: true,
        requiredTokens: 200,
        category: "Finance",
      },
    ]
    setGroups(sampleGroups)

    // Load active votes
    const sampleVotes = [
      {
        id: 1,
        groupId: 1,
        groupName: "TON Developers",
        title: "Should we ban user @spammer123?",
        description: "User has been posting irrelevant content repeatedly",
        votesFor: 45,
        votesAgainst: 12,
        totalVotes: 57,
        endsIn: "2 days",
        hasVoted: false,
      },
      {
        id: 2,
        groupId: 2,
        groupName: "Crypto Artists",
        title: "New community guidelines proposal",
        description: "Updated rules for artwork sharing and attribution",
        votesFor: 78,
        votesAgainst: 23,
        totalVotes: 101,
        endsIn: "5 hours",
        hasVoted: true,
      },
    ]
    setActiveVotes(sampleVotes)
  }, [])

  const handleJoinGroup = (groupId: number) => {
    setGroups(
      groups.map((group) => (group.id === groupId ? { ...group, isJoined: true, members: group.members + 1 } : group)),
    )
    speak("Joined group successfully")
    toast({
      title: "Group Joined",
      description: "You've successfully joined the group!",
    })
  }

  const handleVote = (voteId: number, support: boolean) => {
    setActiveVotes(
      activeVotes.map((vote) =>
        vote.id === voteId
          ? {
              ...vote,
              hasVoted: true,
              votesFor: support ? vote.votesFor + 1 : vote.votesFor,
              votesAgainst: !support ? vote.votesAgainst + 1 : vote.votesAgainst,
              totalVotes: vote.totalVotes + 1,
            }
          : vote,
      ),
    )
    speak(`Voted ${support ? "for" : "against"} the proposal`)
    toast({
      title: "Vote Recorded",
      description: `Your vote has been recorded on the blockchain`,
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Smart Groups</h2>
        <Button aria-label="Create new group">
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Active Votes Section */}
      {activeVotes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Vote className="h-5 w-5" />
              Active DAO Votes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeVotes.map((vote) => (
              <div key={vote.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{vote.groupName}</Badge>
                      <Badge variant="secondary">Ends in {vote.endsIn}</Badge>
                    </div>
                    <h4 className="font-medium mb-1">{vote.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{vote.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>For: {vote.votesFor}</span>
                    <span>Against: {vote.votesAgainst}</span>
                    <span>Total: {vote.totalVotes}</span>
                  </div>
                  <Progress value={(vote.votesFor / vote.totalVotes) * 100} className="h-2" />
                </div>

                {!vote.hasVoted ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleVote(vote.id, true)}
                      className="flex items-center gap-2"
                      aria-label={`Vote for: ${vote.title}`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Vote For
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVote(vote.id, false)}
                      className="flex items-center gap-2"
                      aria-label={`Vote against: ${vote.title}`}
                    >
                      <ThumbsDown className="h-4 w-4" />
                      Vote Against
                    </Button>
                  </div>
                ) : (
                  <Badge variant="secondary">✓ You have voted</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={group.avatar || "/placeholder.svg"} alt={`${group.name} avatar`} />
                  <AvatarFallback>{group.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{group.name}</h3>
                    {group.tokenGated && <Shield className="h-4 w-4 text-blue-500" />}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{group.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {group.members.toLocaleString()} members
                    </div>
                    <Badge variant="outline">{group.category}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {group.tokenGated && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <Shield className="h-4 w-4 inline mr-1" />
                    Token-gated: Requires {group.requiredTokens} TON tokens
                  </p>
                </div>
              )}

              {group.isJoined ? (
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="flex items-center gap-1">
                    ✓ Joined
                  </Badge>
                  <Button variant="outline" size="sm">
                    View Group
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => handleJoinGroup(group.id)}
                  className="w-full"
                  aria-label={`Join ${group.name} group`}
                >
                  Join Group
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
