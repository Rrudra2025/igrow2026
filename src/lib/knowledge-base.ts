export interface QAEntry {
  id: string
  question: string
  answer: string
  createdAt: number
}

export const qaEntries: QAEntry[] = []

export function addQA(question: string, answer: string) {
  const entry: QAEntry = { id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, question, answer, createdAt: Date.now() }
  qaEntries.unshift(entry)
  return entry
}

export function removeQA(id: string) {
  const idx = qaEntries.findIndex(e => e.id === id)
  if (idx !== -1) qaEntries.splice(idx, 1)
}

export function findBestAnswer(message: string) {
  const text = (message || '').toLowerCase()
  // simple substring matching by question text
  for (const entry of qaEntries) {
    const q = entry.question.toLowerCase()
    if (text.includes(q) || q.includes(text)) return entry.answer
  }
  // fallback: try keyword matching
  for (const entry of qaEntries) {
    const q = entry.question.toLowerCase()
    const parts = q.split(/\s+/).slice(0,4)
    if (parts.every(p => p && text.includes(p))) return entry.answer
  }
  return null
}
