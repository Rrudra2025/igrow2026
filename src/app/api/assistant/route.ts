import { NextRequest, NextResponse } from 'next/server'
import { findBestAnswer } from '@/lib/knowledge-base'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const message = (body?.message || '').toString()
    if (!message) return NextResponse.json({ error: 'No message' }, { status: 400 })

    const answer = findBestAnswer(message)
    if (answer) {
      return NextResponse.json({ assistant: 'Growi', reply: answer })
    }

    // default fallback
    return NextResponse.json({ assistant: 'Growi', reply: "I'm sorry — I don't have an answer for that yet. An admin can add it to my knowledge base." })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ assistant: 'Growi', info: 'Send POST { message } to receive assistant replies.' })
}
