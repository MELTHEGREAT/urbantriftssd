const PRIORITY = { High: 'bg-red-50 text-red-800 border-red-200', Medium: 'bg-amber-50 text-amber-800 border-amber-200', Low: 'bg-ivory-100 text-charcoal-700 border-ivory-200' }
const STATUS = { Open: 'bg-moss-100 text-moss-700 border-moss-600/30', Pending: 'bg-amber-50 text-amber-800 border-amber-200', Resolved: 'bg-white text-charcoal-500 border-ivory-200' }
const base = 'inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-medium'

export const PriorityBadge = ({ value }) => <span className={`${base} ${PRIORITY[value]}`}>{value}</span>
export const StatusBadge = ({ value }) => <span className={`${base} ${STATUS[value]}`}>{value}</span>
export const FlagBadge = () => <span className={`${base} border-red-200 bg-red-50 text-red-800`}>Escalated</span>
