"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, AlertCircle, Terminal, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      router.push("/admin")
    } catch (err: any) {
      setError(err.message || "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md relative">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl border border-cyan-500/30 mb-4 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <Sparkles className="h-10 w-10 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            PKonstruct AI
          </h1>
          <p className="text-gray-500 font-mono text-sm mt-2">// Admin Console Authentication</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-8 shadow-2xl">
          {/* Terminal-style header */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#222222]">
            <Terminal className="h-4 w-4 text-cyan-500" />
            <span className="text-xs text-gray-500 font-mono">pkonstruct@admin:~$ login</span>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-mono">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-400 text-sm font-mono flex items-center gap-2">
                <span className="text-cyan-500">➜</span> Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50 focus:ring-cyan-500/20 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-400 text-sm font-mono flex items-center gap-2">
                <Lock className="h-3 w-3 text-cyan-500" /> Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#1a1a1a] border-[#333333] text-white placeholder:text-gray-600 focus:border-cyan-500/50 focus:ring-cyan-500/20 font-mono"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 shadow-[0_0_20px_rgba(6,182,212,0.3)] font-mono"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-pulse">_</span> authenticating...
                </span>
              ) : (
                "authenticate()"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#222222] text-center space-y-3">
            <p className="text-sm text-gray-500 font-mono">
              Need access?{" "}
              <Link href="/admin/register" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                request_account()
              </Link>
            </p>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-400 transition-colors font-mono">
              <ArrowLeft className="h-3 w-3" />
              return_home()
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 font-mono mt-6">
          // PKonstruct Admin Console v1.0.0
        </p>
      </div>
    </div>
  )
}
