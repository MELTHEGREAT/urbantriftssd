import { useState } from 'react'
import { Lock, Trash2 } from 'lucide-react'

// Internal notes are for the team only. They are never part of the reply and never sent to the AI.
export default function InternalNotes({ notes, onAdd, onDelete }) {
  const [text, setText] = useState('')
  const add = () => {
    if (!text.trim()) return
    onAdd(text.trim())
    setText('')
  }
  return (
    <div className="border border-amber-200 bg-amber-50/60 p-3">
      <h3 className="flex items-center gap-1.5 text-sm font-semibold"><Lock size={14} aria-hidden="true" /> Internal notes</h3>
      <p className="text-xs text-charcoal-700">Team only. Not part of the customer reply and not sent to the AI.</p>
      {notes.length === 0 ? (
        <p className="mt-2 text-sm text-charcoal-500">No internal notes yet.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {notes.map((n) => (
            <li key={n.id} className="flex items-start justify-between gap-2 rounded bg-white p-2 text-sm">
              <div className="min-w-0">
                <p className="whitespace-pre-wrap break-words">{n.text}</p>
                <p className="text-xs text-charcoal-500">{new Date(n.time).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
              </div>
              <button onClick={() => onDelete(n.id)} aria-label="Delete note" className="shrink-0 text-charcoal-500 hover:text-red-800"><Trash2 size={15} aria-hidden="true" /></button>
            </li>
          ))}
        </ul>
      )}
      <label htmlFor="note-text" className="sr-only">New internal note</label>
      <textarea id="note-text" rows={2} value={text} onChange={(e) => setText(e.target.value)} maxLength={1000}
        placeholder="Add a note for your team" className="mt-2 w-full rounded border border-ivory-200 bg-white p-2 text-sm" />
      <button onClick={add} disabled={!text.trim()} className="mt-1 rounded border border-charcoal-500 px-3 py-1.5 text-sm hover:bg-white disabled:opacity-40">Add note</button>
    </div>
  )
}
