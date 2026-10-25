import { STATUSES, PRIORITIES, CATEGORIES } from '../data/tickets'

const KEY = 'urbanTrifts.supportDesk.v1'
const str = (v) => typeof v === 'string'

// A saved ticket must have the fields the UI reads. Anything else is treated as corrupt.
const isValidTicket = (t) =>
  t && typeof t === 'object' &&
  [t.id, t.customer, t.subject, t.message, t.category, t.priority, t.received, t.reply, t.escalation].every(str) &&
  STATUSES.includes(t.status) &&
  typeof t.escalate === 'boolean' &&
  t.order && typeof t.order === 'object' &&
  Array.isArray(t.history) && t.history.every((m) => m && str(m.text) && str(m.time) && str(m.from)) &&
  Array.isArray(t.checklist) && t.checklist.every(str) &&
  Array.isArray(t.sources) && t.sources.every(str)

// Phase 5 added: notes, flagged, flagReason. Data saved before Phase 5 lacks them,
// so we fill in safe defaults instead of rejecting the ticket.
const cleanNotes = (n) =>
  Array.isArray(n) ? n.filter((x) => x && str(x.id) && str(x.text) && str(x.time)) : []

const normalizeTicket = (t) => ({
  ...t,
  priority: PRIORITIES.includes(t.priority) ? t.priority : 'Medium',
  category: CATEGORIES.includes(t.category) ? t.category : CATEGORIES[0],
  notes: cleanNotes(t.notes),
  flagged: t.flagged === true,
  flagReason: str(t.flagReason) ? t.flagReason : '',
})

// Keep only entries whose value has the expected type.
const cleanMap = (obj, type) =>
  obj && typeof obj === 'object' && !Array.isArray(obj)
    ? Object.fromEntries(Object.entries(obj).filter(([, v]) => typeof v === type))
    : {}

/** Returns saved state, or null if nothing usable is stored. Never throws. */
export function loadState() {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return null
    const p = JSON.parse(raw)
    if (!p || p.version !== 1 || !Array.isArray(p.tickets) || p.tickets.length === 0 || !p.tickets.every(isValidTicket)) return null
    return {
      tickets: p.tickets.map(normalizeTicket),
      drafts: cleanMap(p.drafts, 'string'),
      savedAt: cleanMap(p.savedAt, 'string'),
      generated: cleanMap(p.generated, 'boolean'),
    }
  } catch {
    return null
  }
}

/** Returns true if the write succeeded. Never throws. */
export function saveState(state) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ version: 1, ...state }))
    return true
  } catch {
    return false
  }
}

export function clearState() {
  try { window.localStorage.removeItem(KEY) } catch { /* storage unavailable */ }
}
