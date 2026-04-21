"use client"

import { useState, useEffect } from "react"
import { useChatSessions } from "@/hooks/use-chat-sessions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { 
  MessageCircle, 
  Settings, 
  Users,
  Bot,
  Send,
  X,
  CheckCircle,
  Loader2,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Clock,
  AlertCircle,
  Eye,
  EyeOff,
  Globe,
  LayoutGrid
} from "lucide-react"
import { format } from "date-fns"
import { ChatMessage, toDate } from "@/hooks/use-chatbot"

export default function MessagesManagementPage() {
  const {
    sessions,
    activeSession,
    setActiveSession,
    config,
    qaPairs,
    loading,
    stats,
    updateConfig,
    takeOverSession,
    returnToBot,
    sendAdminMessage,
    markSessionAsRead,
    getUnreadCount,
    addQAPair,
    updateQAPair,
    deleteQAPair,
    deleteSession
  } = useChatSessions()

  const [mounted, setMounted] = useState(false)
  const [adminMessage, setAdminMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  
  // Config form state
  const [configForm, setConfigForm] = useState({
    enabled: true,
    welcomeMessage: '',
    systemPrompt: '',
    position: 'bottom-right' as 'bottom-right' | 'bottom-left',
    primaryColor: '#06b6d4',
    workingHoursEnabled: false,
    workingHoursStart: '09:00',
    workingHoursEnd: '18:00',
    timezone: 'Asia/Manila',
    offlineMessage: ''
  })

  // Q&A form state
  const [qaForm, setQaForm] = useState({
    question: '',
    answer: '',
    keywords: '',
    enabled: true
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync config form with loaded config
  useEffect(() => {
    if (config) {
      setConfigForm({
        enabled: config.enabled,
        welcomeMessage: config.welcomeMessage,
        systemPrompt: config.systemPrompt,
        position: config.position,
        primaryColor: config.primaryColor,
        workingHoursEnabled: config.workingHours?.enabled || false,
        workingHoursStart: config.workingHours?.start || '09:00',
        workingHoursEnd: config.workingHours?.end || '18:00',
        timezone: config.workingHours?.timezone || 'Asia/Manila',
        offlineMessage: config.workingHours?.offlineMessage || ''
      })
    }
  }, [config])

  const handleSaveConfig = async () => {
    await updateConfig({
      enabled: configForm.enabled,
      welcomeMessage: configForm.welcomeMessage,
      systemPrompt: configForm.systemPrompt,
      position: configForm.position,
      primaryColor: configForm.primaryColor,
      workingHours: {
        enabled: configForm.workingHoursEnabled,
        start: configForm.workingHoursStart,
        end: configForm.workingHoursEnd,
        timezone: configForm.timezone,
        offlineMessage: configForm.offlineMessage
      }
    })
  }

  const handleAddQA = async () => {
    if (!qaForm.question.trim() || !qaForm.answer.trim()) return
    
    await addQAPair({
      question: qaForm.question,
      answer: qaForm.answer,
      keywords: qaForm.keywords.split(',').map(k => k.trim()).filter(Boolean),
      enabled: qaForm.enabled,
      order: qaPairs.length
    })
    
    setQaForm({ question: '', answer: '', keywords: '', enabled: true })
  }

  const handleSendAsAdmin = async () => {
    if (!activeSession || !adminMessage.trim()) return
    
    setIsSending(true)
    await sendAdminMessage(activeSession.id, adminMessage)
    setAdminMessage('')
    setIsSending(false)
  }

  const renderMessage = (msg: ChatMessage) => {
    const isUser = msg.type === 'user'
    
    return (
      <div
        key={msg.id}
        className={cn(
          "flex gap-3 mb-3",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs",
            isUser 
              ? "bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 border border-cyan-500/30 text-cyan-400" 
              : "bg-gradient-to-br from-purple-500/20 to-purple-500/10 border border-purple-500/30 text-purple-400"
          )}
        >
          {isUser ? 'U' : 'B'}
        </div>
        <div
          className={cn(
            "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
            isUser
              ? "bg-cyan-600 text-white rounded-br-md"
              : "bg-[#252525] text-gray-200 rounded-bl-md border border-[#333]"
          )}
        >
          <p>{msg.content}</p>
          <p className="text-xs opacity-50 mt-1">
            {format(toDate(msg.timestamp), 'h:mm a')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6 transition-all duration-500", mounted ? "opacity-100" : "opacity-0")}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg border border-cyan-500/30">
              <MessageCircle className="h-5 w-5 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Messages</h1>
          </div>
          <p className="text-gray-500 font-mono text-sm">// Chatbot configuration & conversations</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn(
            "border-0",
            config?.enabled ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
          )}>
            {config?.enabled ? 'Enabled' : 'Disabled'}
          </Badge>
          {activeSession?.status === 'human_takeover' && (
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
              Human Mode
            </Badge>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-[#1a1a1a] border-[#333]">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1a] border-[#333]">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-cyan-400">{stats.active}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1a] border-[#333]">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Human</p>
            <p className="text-2xl font-bold text-amber-400">{stats.humanTakeover}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1a] border-[#333]">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Closed</p>
            <p className="text-2xl font-bold text-gray-400">{stats.closed}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1a] border-[#333]">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.today}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="conversations" className="space-y-4">
        <TabsList className="bg-[#1a1a1a] border border-[#333]">
          <TabsTrigger value="conversations" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Users className="w-4 h-4 mr-2" />
            Conversations
          </TabsTrigger>
          <TabsTrigger value="qa" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <LayoutGrid className="w-4 h-4 mr-2" />
            Q&A
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Conversations Tab */}
        <TabsContent value="conversations" className="space-y-4">
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Session List */}
            <Card className="bg-[#1a1a1a] border-[#333] lg:col-span-1">
              <CardContent className="p-0">
                <div className="p-4 border-b border-[#333]">
                  <h3 className="font-semibold text-white">Active Conversations</h3>
                </div>
                <div className="divide-y divide-[#333] max-h-[500px] overflow-y-auto">
                  {sessions.map((session) => {
                    const unreadCount = getUnreadCount(session)
                    return (
                      <button
                        key={session.id}
                        onClick={() => {
                          setActiveSession(session)
                          markSessionAsRead(session.id)
                        }}
                        className={cn(
                          "w-full p-4 text-left hover:bg-[#222] transition-colors relative",
                          activeSession?.id === session.id ? "bg-[#252525] border-l-2 border-cyan-500" : ""
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-white truncate">
                            {session.messages[session.messages.length - 1]?.content.substring(0, 30) || 'New Chat'}...
                          </span>
                          <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                              <Badge 
                                variant="default" 
                                className="bg-red-500 text-white text-xs font-bold"
                              >
                                {unreadCount > 9 ? '9+' : unreadCount}
                              </Badge>
                            )}
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs",
                                session.status === 'active' ? "bg-cyan-500/10 text-cyan-400" :
                                session.status === 'human_takeover' ? "bg-amber-500/10 text-amber-400" :
                                "bg-gray-500/10 text-gray-400"
                              )}
                            >
                              {session.status === 'human_takeover' ? 'Human' : session.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {format(toDate(session.updatedAt), 'MMM d, h:mm a')}
                        </p>
                      </button>
                    )
                  })}
                  {sessions.length === 0 && (
                    <p className="p-4 text-gray-500 text-center">No conversations yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Chat View */}
            <Card className="bg-[#1a1a1a] border-[#333] lg:col-span-2">
              <CardContent className="p-0 flex flex-col h-[600px]">
                {activeSession ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-[#333] flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">Conversation</p>
                        <p className="text-xs text-gray-500">{activeSession.pageUrl}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {activeSession.status !== 'human_takeover' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => takeOverSession(activeSession.id)}
                            className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Take Over
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => returnToBot(activeSession.id)}
                            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                          >
                            <Bot className="w-4 h-4 mr-2" />
                            Return to Bot
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteSession(activeSession.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                      {activeSession.messages
                        .slice()
                        .sort((a, b) => toDate(a.timestamp).getTime() - toDate(b.timestamp).getTime())
                        .map(renderMessage)}
                    </div>

                    {/* Input */}
                    {activeSession.status === 'human_takeover' && (
                      <div className="p-4 border-t border-[#333] bg-[#111]">
                        <div className="flex gap-2">
                          <Input
                            value={adminMessage}
                            onChange={(e) => setAdminMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendAsAdmin()}
                            placeholder="Type your message as admin..."
                            className="flex-1 bg-[#1a1a1a] border-[#333] text-white"
                          />
                          <Button
                            onClick={handleSendAsAdmin}
                            disabled={!adminMessage.trim() || isSending}
                            className="bg-cyan-600 hover:bg-cyan-500"
                          >
                            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    Select a conversation to view
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Q&A Tab */}
        <TabsContent value="qa" className="space-y-4">
          {/* Add Q&A Form */}
          <Card className="bg-[#1a1a1a] border-[#333]">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-white mb-4">Add Quick Question</h3>
              <Input
                placeholder="Question (e.g., What are your business hours?)"
                value={qaForm.question}
                onChange={(e) => setQaForm({ ...qaForm, question: e.target.value })}
                className="bg-[#111] border-[#333] text-white"
              />
              <Textarea
                placeholder="Answer"
                value={qaForm.answer}
                onChange={(e) => setQaForm({ ...qaForm, answer: e.target.value })}
                className="bg-[#111] border-[#333] text-white min-h-[80px]"
              />
              <Input
                placeholder="Keywords (comma-separated: hours, time, open)"
                value={qaForm.keywords}
                onChange={(e) => setQaForm({ ...qaForm, keywords: e.target.value })}
                className="bg-[#111] border-[#333] text-white"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={qaForm.enabled}
                    onCheckedChange={(checked: boolean) => setQaForm({ ...qaForm, enabled: checked })}
                  />
                  <span className="text-sm text-gray-400">Enabled</span>
                </div>
                <Button onClick={handleAddQA} className="bg-cyan-600 hover:bg-cyan-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Q&A List */}
          <div className="grid gap-4">
            {qaPairs.map((qa, index) => (
              <Card key={qa.id} className="bg-[#1a1a1a] border-[#333]">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-white mb-1">{qa.question}</p>
                      <p className="text-sm text-gray-400 mb-2">{qa.answer}</p>
                      <div className="flex flex-wrap gap-2">
                        {qa.keywords.map((keyword, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-[#252525] rounded text-gray-500">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={qa.enabled}
                        onCheckedChange={(checked: boolean) => updateQAPair(qa.id, { enabled: checked })}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteQAPair(qa.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="bg-[#1a1a1a] border-[#333]">
            <CardContent className="p-6 space-y-6">
              {/* Enable/Disable */}
              <div className="flex items-center justify-between p-4 bg-[#111] rounded-lg border border-[#333]">
                <div>
                  <p className="font-medium text-white">Enable Chatbot</p>
                  <p className="text-sm text-gray-500">Show chatbot on website</p>
                </div>
                <Switch
                  checked={configForm.enabled}
                  onCheckedChange={(checked: boolean) => setConfigForm({ ...configForm, enabled: checked })}
                />
              </div>

              {/* Welcome Message */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Welcome Message</label>
                <Textarea
                  value={configForm.welcomeMessage}
                  onChange={(e) => setConfigForm({ ...configForm, welcomeMessage: e.target.value })}
                  className="bg-[#111] border-[#333] text-white"
                />
              </div>

              {/* System Prompt */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">AI System Prompt</label>
                <Textarea
                  value={configForm.systemPrompt}
                  onChange={(e) => setConfigForm({ ...configForm, systemPrompt: e.target.value })}
                  className="bg-[#111] border-[#333] text-white min-h-[100px]"
                  placeholder="Instructions for the AI on how to respond..."
                />
                <p className="text-xs text-gray-600">
                  Define the AI's personality, knowledge, and response style
                </p>
              </div>

              {/* Position */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Position</label>
                <select
                  value={configForm.position}
                  onChange={(e) => setConfigForm({ ...configForm, position: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-md bg-[#111] border border-[#333] text-white"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                </select>
              </div>

              {/* Working Hours */}
              <div className="p-4 bg-[#111] rounded-lg border border-[#333] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Working Hours</p>
                    <p className="text-sm text-gray-500">Show offline message outside hours</p>
                  </div>
                  <Switch
                    checked={configForm.workingHoursEnabled}
                    onCheckedChange={(checked: boolean) => setConfigForm({ ...configForm, workingHoursEnabled: checked })}
                  />
                </div>
                
                {configForm.workingHoursEnabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Start Time</label>
                      <Input
                        type="time"
                        value={configForm.workingHoursStart}
                        onChange={(e) => setConfigForm({ ...configForm, workingHoursStart: e.target.value })}
                        className="bg-[#1a1a1a] border-[#333] text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">End Time</label>
                      <Input
                        type="time"
                        value={configForm.workingHoursEnd}
                        onChange={(e) => setConfigForm({ ...configForm, workingHoursEnd: e.target.value })}
                        className="bg-[#1a1a1a] border-[#333] text-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-gray-500">Offline Message</label>
                      <Input
                        value={configForm.offlineMessage}
                        onChange={(e) => setConfigForm({ ...configForm, offlineMessage: e.target.value })}
                        className="bg-[#1a1a1a] border-[#333] text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <Button onClick={handleSaveConfig} className="w-full bg-cyan-600 hover:bg-cyan-500">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
