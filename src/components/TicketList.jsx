import { PriorityBadge, StatusBadge, FlagBadge } from './Badges'
import { STATUSES } from '../data/tickets'

export default function TicketList({ tickets, selectedId, onSelect, filter, onFilter }) {
  return (
    <section aria-label="Ticket inbox" className="flex min-h-0 flex-col border border-ivory-200 bg-white">
      <div role="group" aria-label="Filter by status" className="flex gap-1 border-b border-ivory-200 p-2">
        {['All', ...STATUSES].map((s) => (
          <button key={s} onClick={() => onFilter(s)} aria-pressed={filter === s}
            className={`rounded px-2.5 py-1 text-xs font-medium ${filter === s ? 'bg-charcoal-900 text-white' : 'text-charcoal-700 hover:bg-ivory-100'}`}>
            {s}
          </button>
        ))}
      </div>
      {tickets.length === 0 ? (
        <p className="p-6 text-sm text-charcoal-500">No tickets match. Clear the search or choose another status.</p>
      ) : (
        <ul className="divide-y divide-ivory-200 overflow-y-auto">
          {tickets.map((t) => (
            <li key={t.id}>
              <button onClick={() => onSelect(t.id)} aria-current={selectedId === t.id ? 'true' : undefined}
                className={`block w-full px-4 py-3 text-left hover:bg-ivory-50 ${selectedId === t.id ? 'bg-moss-100/60 shadow-[inset_3px_0_0_#4f6b57]' : ''}`}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-semibold">{t.customer}</span>
                  <span className="shrink-0 text-xs text-charcoal-500">{t.received}</span>
                </div>
                <p className="truncate text-sm">{t.subject}</p>
                <p className="truncate text-xs text-charcoal-500">{t.message}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-charcoal-700">{t.category}</span>
                  <PriorityBadge value={t.priority} />
                  <StatusBadge value={t.status} />
                  {t.flagged && <FlagBadge />}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
