import { useState } from 'react'
import { AlertTriangle, BookMarked, Loader2 } from 'lucide-react'
import { sourcesFor } from '../data/knowledgeBase'

const BADGE = {
  live: ['Live AI draft. Review before use.', 'border-moss-600/40 bg-moss-100 text-moss-700'],
  mock: ['Mock mode: no AI was called', 'border-amber-300 bg-amber-50 text-amber-900'],
  none: ['No draft generated yet', 'border-ivory-200 bg-ivory-50 text-charcoal-700'],
}

export default function AiPanel({ ticket, ai }) {
  const [checked, setChecked] = useState({})
  const toggle = (item) => setChecked((c) => ({ ...c, [item]: !c[item] }))
  const result = ai?.result
  const [badgeText, badgeCls] = BADGE[result?.mode ?? 'none']
  const escalate = result ? result.escalate : ticket.escalate
  const escalationText = result ? (result.escalationReason || (result.escalate ? 'AI recommends human review.' : 'No escalation recommended. Agent judgment still applies.')) : ticket.escalation
  const checklist = result?.needsVerification?.length ? result.needsVerification : ticket.checklist

  return (
    <aside aria-label="AI assistance" className="flex flex-col gap-4 border border-ivory-200 bg-white p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg">AI assistance</h2>
        <span className={`rounded border px-1.5 py-0.5 text-xs font-medium ${badgeCls}`}>{badgeText}</span>
      </div>

      <div role="status" aria-live="polite">
        {ai?.status === 'loading' && <p className="flex items-center gap-2 text-sm text-charcoal-700"><Loader2 size={15} className="animate-spin" aria-hidden="true" /> Generating a draft...</p>}
        {ai?.status === 'error' && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-900">{ai.error}</p>}
        {result && ai.status === 'done' && <p className="text-sm text-charcoal-700">Draft placed in the reply box. Edit it, then save. Nothing is sent.</p>}
        {!ai && <p className="text-sm text-charcoal-500">Select Generate AI Reply to draft a response from this ticket and the knowledge base.</p>}
      </div>

      <div>
        <h3 className="flex items-center gap-1.5 text-sm font-semibold"><BookMarked size={14} aria-hidden="true" /> Knowledge sources</h3>
        <ul className="mt-1 list-disc pl-5 text-sm text-charcoal-700">{sourcesFor(ticket.category).map((s) => <li key={s.id}>{s.title}</li>)}</ul>
        <p className="text-xs text-charcoal-500">Fictional demo knowledge base. The server picks entries by ticket category.</p>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold">{result?.needsVerification?.length ? 'Agent must verify' : 'Verification checklist'}</legend>
        <div className="mt-1 space-y-1">
          {checklist.map((item) => (
            <label key={item} className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={!!checked[`${ticket.id}${item}`]} onChange={() => toggle(`${ticket.id}${item}`)} className="mt-1 accent-moss-600" />
              {item}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={`rounded border p-3 text-sm ${escalate ? 'border-red-200 bg-red-50 text-red-900' : 'border-ivory-200 bg-ivory-50'}`}>
        <h3 className="flex items-center gap-1.5 font-semibold">{escalate && <AlertTriangle size={14} aria-hidden="true" />} Escalation recommendation</h3>
        <p>{escalationText}</p>
      </div>
    </aside>
  )
}
