const Stat = ({ label, value, note, tone }) => (
  <div className="border border-l-4 border-ivory-200 bg-white px-4 py-3" style={{ borderLeftColor: tone }}>
    <p className="text-xs text-charcoal-500">{label}</p>
    <p className="font-display text-3xl leading-tight">{value}</p>
    <p className="text-xs text-charcoal-500">{note}</p>
  </div>
)

export default function StatCards({ tickets }) {
  const count = (s) => tickets.filter((t) => t.status === s).length
  const esc = tickets.filter((t) => (t.escalate || t.flagged) && t.status !== 'Resolved').length
  return (
    <section aria-label="Ticket summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Stat label="Open tickets" value={count('Open')} note="Need a reply" tone="#4f6b57" />
      <Stat label="Pending tickets" value={count('Pending')} note="Waiting on customer or team" tone="#b8892f" />
      <Stat label="Resolved tickets" value={count('Resolved')} note="Closed in this demo" tone="#9a9d98" />
      <Stat label="Escalations to review" value={esc} note="Manager decision needed" tone="#a2423a" />
    </section>
  )
}
