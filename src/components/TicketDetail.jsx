import { Sparkles, Save, CheckCircle2 } from 'lucide-react'
import { PriorityBadge, StatusBadge, FlagBadge } from './Badges'
import TicketControls from './TicketControls'
import InternalNotes from './InternalNotes'

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4 py-1 text-sm">
    <dt className="text-charcoal-500">{label}</dt>
    <dd className="text-right">{value}</dd>
  </div>
)

export default function TicketDetail({ ticket, draft, notice, unsaved, aiBusy, hasDraft, savedLabel, onDraft, onGenerate, onSave, onResolve, onField, onFlag, onAddNote, onDeleteNote }) {
  const resolved = ticket.status === 'Resolved'
  return (
    <section aria-label={`Ticket ${ticket.id} details`} className="flex flex-col gap-4 border border-ivory-200 bg-white p-4 md:p-5">
      <div>
        <p className="text-xs text-charcoal-500">{ticket.id} &middot; {ticket.category}</p>
        <h2 className="font-display text-xl">{ticket.subject}</h2>
        <div className="mt-2 flex gap-1.5"><PriorityBadge value={ticket.priority} /><StatusBadge value={ticket.status} />{ticket.flagged && <FlagBadge />}</div>
      </div>

      <TicketControls key={ticket.id} ticket={ticket} onChange={onField} onFlag={onFlag} />

      <div className="border-l-2 border-moss-600 bg-ivory-50 p-3 text-sm">
        <p className="mb-1 text-xs font-medium text-charcoal-500">Customer message from {ticket.customer}</p>
        {ticket.message}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold">Order details (sample data)</h3>
          <dl className="divide-y divide-ivory-200">
            <Row label="Order" value={ticket.order.number} />
            <Row label="Items" value={ticket.order.items} />
            <Row label="Total" value={ticket.order.total} />
            <Row label="Shipping" value={ticket.order.shipping} />
            <Row label="Tracking" value={ticket.order.tracking} />
          </dl>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Conversation history</h3>
          <ol className="mt-1 space-y-2">
            {ticket.history.map((m, i) => (
              <li key={i} className={`rounded p-2 text-sm ${m.from === 'agent' ? 'bg-moss-100' : 'bg-ivory-100'}`}>
                <p className="text-xs text-charcoal-500">{m.from === 'agent' ? 'Agent' : ticket.customer} &middot; {m.time}</p>
                {m.text}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <InternalNotes notes={ticket.notes ?? []} onAdd={onAddNote} onDelete={onDeleteNote} />

      <div>
        <label htmlFor="reply" className="text-sm font-semibold">Reply</label>
        <textarea id="reply" rows={6} value={draft} onChange={(e) => onDraft(e.target.value)} disabled={resolved}
          placeholder={resolved ? 'This ticket is resolved.' : 'Write a reply, or generate a demo draft.'}
          className="mt-1 w-full rounded border border-ivory-200 bg-white p-3 text-sm disabled:bg-ivory-100" />
        <p className="text-xs text-charcoal-500">
          Demo only. Nothing is sent to a customer.
          {!resolved && unsaved && <span className="ml-2 font-medium text-amber-800">Unsaved changes</span>}
          {!resolved && !unsaved && savedLabel && <span className="ml-2 text-moss-700">Draft saved at {savedLabel}</span>}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button onClick={onGenerate} disabled={resolved || aiBusy} className="inline-flex items-center gap-1.5 rounded bg-charcoal-900 px-3 py-2 text-sm text-white hover:bg-charcoal-700 disabled:opacity-40">
            <Sparkles size={15} aria-hidden="true" /> {aiBusy ? 'Generating...' : hasDraft ? 'Regenerate AI Reply' : 'Generate AI Reply'}
          </button>
          <button onClick={onSave} disabled={resolved} className="inline-flex items-center gap-1.5 rounded border border-charcoal-500 px-3 py-2 text-sm hover:bg-ivory-100 disabled:opacity-40">
            <Save size={15} aria-hidden="true" /> Save Draft
          </button>
          <button onClick={onResolve} disabled={resolved} className="inline-flex items-center gap-1.5 rounded bg-moss-600 px-3 py-2 text-sm text-white hover:bg-moss-700 disabled:opacity-40">
            <CheckCircle2 size={15} aria-hidden="true" /> Mark as Resolved
          </button>
        </div>
        <p role="status" aria-live="polite" className="mt-2 min-h-5 text-sm text-moss-700">{notice}</p>
      </div>
    </section>
  )
}
