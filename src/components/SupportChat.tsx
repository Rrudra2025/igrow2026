"use client"

import React, { useState } from 'react'

type Msg = { from: 'user' | 'growi'; text: string }

export default function SupportChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([])
  const [loading, setLoading] = useState(false)

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
          <div className="w-80 max-w-sm bg-white/5 border border-white/10 rounded-2xl p-3 mb-2 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Growi — Support</div>
              <button onClick={() => setOpen(false)} className="text-sm text-foreground/60">Close</button>
            </div>
            <div className="h-48 overflow-y-auto mb-2 p-1 space-y-2">
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

        <button onClick={() => setOpen(s => !s)} className="w-14 h-14 rounded-full bg-primary shadow-lg text-white flex items-center justify-center font-bold">G</button>
      </div>
    </div>
  )
}
