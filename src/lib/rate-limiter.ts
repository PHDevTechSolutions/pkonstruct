// Simple client-side rate limiting utility
// For production, use server-side rate limiting with Redis or similar

type RateLimitEntry = {
  count: number
  firstAttempt: number
  resetTime: number
}

class RateLimiter {
  private storage: Map<string, RateLimitEntry>
  private defaultLimit: number
  private defaultWindow: number // in milliseconds

  constructor(defaultLimit = 5, defaultWindowMs = 60000) {
    this.storage = new Map()
    this.defaultLimit = defaultLimit
    this.defaultWindow = defaultWindowMs
  }

  /**
   * Check if action is allowed
   * @param key - Unique identifier (e.g., userId + action)
   * @param limit - Max attempts allowed
   * @param windowMs - Time window in milliseconds
   * @returns { allowed: boolean, remaining: number, resetTime: number }
   */
  check(key: string, limit?: number, windowMs?: number): { 
    allowed: boolean
    remaining: number
    resetTime: number
    retryAfter?: number
  } {
    const now = Date.now()
    const maxAttempts = limit || this.defaultLimit
    const timeWindow = windowMs || this.defaultWindow

    const entry = this.storage.get(key)

    // Entry doesn't exist or has expired
    if (!entry || now > entry.resetTime) {
      this.storage.set(key, {
        count: 1,
        firstAttempt: now,
        resetTime: now + timeWindow,
      })
      return {
        allowed: true,
        remaining: maxAttempts - 1,
        resetTime: now + timeWindow,
      }
    }

    // Check if limit exceeded
    if (entry.count >= maxAttempts) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter,
      }
    }

    // Increment count
    entry.count++
    this.storage.set(key, entry)

    return {
      allowed: true,
      remaining: maxAttempts - entry.count,
      resetTime: entry.resetTime,
    }
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.storage.delete(key)
  }

  /**
   * Get current status for a key
   */
  getStatus(key: string): { count: number; remaining: number; resetTime: number } | null {
    const entry = this.storage.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now > entry.resetTime) {
      this.storage.delete(key)
      return null
    }

    return {
      count: entry.count,
      remaining: Math.max(0, this.defaultLimit - entry.count),
      resetTime: entry.resetTime,
    }
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.storage.entries()) {
      if (now > entry.resetTime) {
        this.storage.delete(key)
      }
    }
  }
}

// Create singleton instance
export const rateLimiter = new RateLimiter()

// Action-specific rate limiters
export const checkoutRateLimiter = new RateLimiter(3, 5 * 60 * 1000) // 3 attempts per 5 minutes
export const cartRateLimiter = new RateLimiter(20, 60000) // 20 cart operations per minute
export const searchRateLimiter = new RateLimiter(30, 60000) // 30 searches per minute
export const contactRateLimiter = new RateLimiter(5, 3600000) // 5 contact submissions per hour

// Hook for using rate limiter in React components
export function useRateLimiter(
  action: string,
  userId?: string,
  limit?: number,
  windowMs?: number
) {
  const key = `${action}:${userId || 'anonymous'}`
  
  const check = () => rateLimiter.check(key, limit, windowMs)
  const reset = () => rateLimiter.reset(key)
  const getStatus = () => rateLimiter.getStatus(key)

  return { check, reset, getStatus }
}
