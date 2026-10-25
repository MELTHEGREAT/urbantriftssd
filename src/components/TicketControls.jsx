import { useState } from 'react'
import { Flag } from 'lucide-react'
import { STATUSES, PRIORITIES, CATEGORIES } from '../data/tickets'

const Select = ({ id, label, value, options, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-xs font-medium text-charcoal-500">{label}</label>
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full rounded border border-ivory-200 bg-white px-2 py-1.5 text-sm">
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  </div>
)

// Agent-controlled ticket fields. The escalation flag is a human decision, separate from the AI's advice.
export default function TicketControls({ ticket, onChange, onFlag }) {
  const [reason, setReason] = useState(ticket.flagReason)
  const [error, setError] = useState('')

  const flag = () => {
    if (!reason.trim()) { setError('Add a short reason before escalating.'); return }
    setError('')
    onFlag(true, reason.trim())
  }
  const clear = () => { setError(''); setReason(''); onFlag(false, '') }

  return (
    <div className="space-y-3 border border-ivory-200 bg-ivory-50 p-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <Select id="ctl-status" label="Status" value={ticket.status} options={STATUSES} onChange={(v) => onChange('status', v)} />
        <Select id="ctl-priority" label="Priority" value={ticket.priority} options={PRIORITIES} onChange={(v) => onChange('priority', v)} />
        <Select id="ctl-category" label="Category" value={ticket.category} options={CATEGORIES} onChange={(v) => onChange('category', v)} />
      </div>
      <p className="text-xs text-charcoal-500">Changing the category changes which knowledge base entries the AI uses next time you generate a reply.</p>

      <div>
        <label htmlFor="flag-reason" className="flex items-center gap-1.5 text-xs font-medium text-charcoal-500">
          <Flag size={13} aria-hidden="true" /> Manual escalation
        </label>
        {ticket.flagged ? (
          <div className="mt-1 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-900">
            <p><span className="font-medium">Escalated by agent.</span> {ticket.flagReason}</p>
            <button onClick={clear} className="mt-1 text-xs underline underline-offset-2">Remove escalation</button>
          </div>
        ) : (
          <div className="mt-1 flex flex-col gap-2 sm:flex-row">
            <input id="flag-reason" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={200}
              placeholder="Why does this need a manager?" className="min-w-0 flex-1 rounded border border-ivory-200 bg-white px-2 py-1.5 text-sm" />
            <button onClick={flag} className="rounded border border-red-300 px-3 py-1.5 text-sm text-red-800 hover:bg-red-50">Escalate ticket</button>
          </div>
        )}
        {error && <p role="alert" className="mt-1 text-xs text-red-800">{error}</p>}
      </div>
    </div>
  )
}
