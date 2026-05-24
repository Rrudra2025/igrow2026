"use client"

import React, { useState, useRef, useEffect } from 'react'

type Msg = { from: 'user' | 'growi'; text: string }

export default function SupportChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([])
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, open])

  const send = async () => {
    if (!input.trim()) return
    const text = input.trim()
    setMessages(m => [...m, { from: 'user', text }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text }) })
      const data = await res.json()
      const reply = data?.reply || data?.message || "I'm sorry, I can't answer that right now."
      setMessages(m => [...m, { from: 'growi', text: reply }])
    } catch (err) {
      setMessages(m => [...m, { from: 'growi', text: "Error: failed to reach assistant." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="fixed bottom-6 right-6 z-50">
        {open && (
          <div className="w-80 max-w-sm bg-white/5 border border-white/10 rounded-2xl p-3 mb-2 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Growi — Support</div>
              <button onClick={() => setOpen(false)} className="text-sm text-foreground/60">Close</button>
            </div>
            <div ref={listRef} className="h-48 overflow-y-auto mb-2 p-1 space-y-2">
              {messages.length === 0 && <div className="text-xs text-foreground/60">Hi — ask me anything about iGrow. If I don't know, admin can add answers.</div>}
              {messages.map((m, i) => (
                <div key={i} className={m.from === 'user' ? 'text-right' : 'text-left'}>
                  <div className={`inline-block px-3 py-1 rounded ${m.from === 'user' ? 'bg-primary text-white' : 'bg-white/5 text-foreground'}`}>{m.text}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="flex-1 rounded-lg px-3 py-2 bg-[#0b0f13] border border-white/10 text-sm" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send() }} placeholder="Type your question..." />
              <button onClick={send} disabled={loading} className="px-3 rounded-lg bg-primary text-white">{loading ? '...' : 'Send'}</button>
            </div>
          </div>
        )}

        {/* 3D-like bot button */}
        <button onClick={() => setOpen(s => !s)} aria-label="Open Growi chat" className="w-16 h-16 rounded-full shadow-2xl relative flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6ee7b7,#3b82f6)' }}>
          <div className="absolute inset-0 rounded-full transform rotate-6" style={{ boxShadow: '0 12px 30px rgba(59,130,246,0.25), inset 0 -8px 18px rgba(0,0,0,0.15)' }} />
          <div className="relative z-10 w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="9" r="3" fill="#0f172a" />
              <circle cx="9" cy="8" r="0.9" fill="#ffffff" opacity="0.9" />
              <circle cx="15" cy="8" r="0.9" fill="#ffffff" opacity="0.9" />
              <path d="M8 14c1.333-1 3-1 4 0" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  )
}
