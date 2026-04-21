import { NextRequest, NextResponse } from 'next/server'

// Rate limiting storage (simple in-memory, use Redis in production)
const rateLimits = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT = 20 // messages per hour
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimits.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimits.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }
  
  if (record.count >= RATE_LIMIT) {
    return false
  }
  
  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const { message, history, systemPrompt } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      console.log('No OpenAI API key, using fallback response')
      return NextResponse.json({
        response: "I'm currently operating in basic mode. For more detailed assistance, please contact our team directly or submit an inquiry through our contact form.",
        source: 'fallback'
      })
    }

    // Prepare conversation history for OpenAI
    const messages = [
      {
        role: 'system',
        content: systemPrompt || 'You are a helpful assistant for a construction company website. Answer questions professionally and concisely.'
      },
      ...history.map((msg: any) => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ]

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI API error:', error)
      
      return NextResponse.json({
        response: "I'm having trouble processing your request right now. Please try again in a moment, or contact us directly if you need immediate assistance.",
        source: 'fallback'
      })
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content

    if (!aiResponse) {
      return NextResponse.json({
        response: "I didn't receive a proper response. Could you rephrase your question?",
        source: 'fallback'
      })
    }

    return NextResponse.json({
      response: aiResponse,
      source: 'ai'
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { 
        response: "An unexpected error occurred. Please try again later.",
        source: 'fallback'
      },
      { status: 500 }
    )
  }
}

// Get chat configuration
export async function GET() {
  return NextResponse.json({
    enabled: !!process.env.OPENAI_API_KEY,
    message: 'Chat API is running'
  })
}
