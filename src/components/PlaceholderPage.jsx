export default function PlaceholderPage({ title }) {
  return (
    <div className="m-6 border border-dashed border-charcoal-500/40 bg-white p-8">
      <h2 className="font-display text-xl">{title}</h2>
      <p className="mt-1 max-w-prose text-sm text-charcoal-500">This section is planned for a later stage. Stage 1 covers the Overview and Inbox screens.</p>
    </div>
  )
}
