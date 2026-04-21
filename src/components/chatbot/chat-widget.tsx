"use client"

import { useState, useRef, useEffect } from "react"
import { useChatbot, ChatMessage, toDate } from "@/hooks/use-chatbot"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Maximize2,
  Bot,
  User,
  Loader2,
  Clock
} from "lucide-react"
import { format } from "date-fns"

interface ChatWidgetProps {
  pageUrl: string
}

export function ChatWidget({ pageUrl }: ChatWidgetProps) {
  const { session, config, qaPairs, loading, isTyping, sendMessage, clearSession, shouldShow, isEnabled } = useChatbot(pageUrl)
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const [lastReadAt, setLastReadAt] = useState<number>(Date.now())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Calculate unread messages (bot/ai messages after last read)
  const unreadCount = session?.messages?.filter(
    msg => (msg.type === 'bot' || msg.type === 'ai') && 
           toDate(msg.timestamp).getTime() > lastReadAt
  ).length || 0

  // Auto-scroll to bottom and mark as read when opened
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      // Mark as read when opening chat
      setLastReadAt(Date.now())
    }
  }, [isOpen])

  // Update lastReadAt when new messages arrive (while closed)
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [session?.messages, isOpen, isTyping])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Show chatbot by default unless explicitly disabled
  const canShow = isEnabled && shouldShow()
  
  // Debug logging
  console.log('Chatbot debug:', { isEnabled, shouldShow: shouldShow(), config, canShow, loading })
  
  if (!canShow) {
    return null
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return
    
    const message = inputValue.trim()
    setInputValue("")
    await sendMessage(message)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickQuestion = async (question: string) => {
    await sendMessage(question)
  }

  // Check if within working hours
  const isWithinWorkingHours = () => {
    if (!config?.workingHours?.enabled) return true
    
    const now = new Date()
    const currentTime = format(now, 'HH:mm')
    const { start, end } = config.workingHours
    
    return currentTime >= start && currentTime <= end
  }

  const renderMessage = (msg: ChatMessage) => {
    const isUser = msg.type === 'user'
    
    return (
      <div
        key={msg.id}
        className={cn(
          "flex gap-5 mb-4",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
            isUser 
              ? "bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 border border-cyan-500/30" 
              : "bg-gradient-to-br from-purple-500/20 to-purple-500/10 border border-purple-500/30"
          )}
        >
          {isUser ? (
            <User className="w-4 h-4 text-cyan-400" />
          ) : (
            <Bot className="w-4 h-4 text-purple-400" />
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={cn(
            "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
            isUser
              ? "bg-gradient-to-r from-cyan-600/80 to-cyan-500/80 text-white rounded-br-md"
              : "bg-[#252525] text-gray-200 rounded-bl-md border border-[#333]"
          )}
        >
          <p className="whitespace-pre-wrap">{msg.content}</p>
          <p className="text-xs opacity-50 mt-1">
            {format(toDate(msg.timestamp), 'h:mm a')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed z-[500] w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110",
            "bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500",
            "border-0 flex items-center justify-center",
            "bottom-25 right-6"
          )}
          style={{ right: '1.5rem', left: 'auto' }}
        >
          <MessageCircle className="w-6 h-6 text-white" />
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-ping opacity-20" />
          {/* Unread badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 z-50 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce border-2 border-[#0a0a0a]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 transition-all duration-300",
            "bottom-28 right-6",
            isMinimized 
              ? "w-72 h-14" 
              : "w-96 h-[500px] max-h-[80vh]"
          )}
          style={{ right: '1.5rem', left: 'auto' }}
        >
          <div className={cn(
            "bg-[#1a1a1a] border border-[#333] rounded-2xl shadow-2xl overflow-hidden flex flex-col",
            isMinimized ? "h-full" : "h-full"
          )}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-[#333]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Assistant</p>
                  <p className="text-xs text-gray-500">
                    {isTyping ? 'Typing...' : 'Online'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {/* Working Hours Notice */}
                  {!isWithinWorkingHours() && config?.workingHours?.enabled && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-4">
                      <p className="text-xs text-amber-400 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {config.workingHours.offlineMessage}
                      </p>
                    </div>
                  )}

                  {/* Messages */}
                  {session?.messages
                    .slice()
                    .sort((a, b) => toDate(a.timestamp).getTime() - toDate(b.timestamp).getTime())
                    .map(renderMessage)}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="bg-[#252525] rounded-2xl rounded-bl-md px-4 py-3 border border-[#333]">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                          <span className="text-xs text-gray-500">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Questions */}
                  {qaPairs.length > 0 && !isTyping && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-2">Quick Questions:</p>
                      <div className="flex flex-wrap gap-2">
                        {qaPairs.slice(0, 4).map((qa) => (
                          <button
                            key={qa.id}
                            onClick={() => handleQuickQuestion(qa.question)}
                            className="px-3 py-1.5 text-xs bg-[#252525] hover:bg-[#333] text-gray-300 rounded-full border border-[#333] hover:border-cyan-500/30 transition-colors"
                          >
                            {qa.question.length > 30 ? qa.question.substring(0, 30) + '...' : qa.question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-[#333] bg-[#111]">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 bg-[#1a1a1a] border-[#333] text-white placeholder:text-gray-600 focus:border-cyan-500/50"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!inputValue.trim() || isTyping}
                      className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white border-0 px-3"
                    >
                      {isTyping ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">
                    We typically reply within a few minutes
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
