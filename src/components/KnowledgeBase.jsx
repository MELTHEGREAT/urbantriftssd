import { useState } from 'react'
import { Search } from 'lucide-react'
import { KB_META, GRADING, PRODUCTS, POLICIES, FAQS, ESCALATION } from '../data/knowledgeBase'

const TABS = ['Products', 'Grading', 'Policies', 'FAQs', 'Escalation']

const Card = ({ title, children, tag }) => (
  <article className="border border-ivory-200 bg-white p-4">
    <div className="flex items-baseline justify-between gap-2">
      <h3 className="text-sm font-semibold">{title}</h3>
      {tag && <span className="shrink-0 text-xs text-charcoal-500">{tag}</span>}
    </div>
    <div className="mt-1 text-sm text-charcoal-700">{children}</div>
  </article>
)

export default function KnowledgeBase() {
  const [tab, setTab] = useState('Products')
  const [q, setQ] = useState('')
  const match = (o) => !q.trim() || JSON.stringify(o).toLowerCase().includes(q.trim().toLowerCase())

  const cards = {
    Products: PRODUCTS.filter(match).map((p) => (
      <Card key={p.id} title={p.name} tag={`${p.id} · ${p.status}`}>
        <p>Size {p.size} · insole {p.insole} · grade {p.grade} · {p.price}</p>
        <p className="mt-1">{p.defects.length ? `Disclosed defects: ${p.defects.join('; ')}.` : 'No defects disclosed.'}</p>
      </Card>
    )),
    Grading: GRADING.items.filter(match).map((g) => (
      <Card key={g.grade} title={`Grade ${g.grade}: ${g.name}`}>{g.note}</Card>
    )),
    Policies: POLICIES.filter(match).map((p) => (
      <Card key={p.id} title={p.title}><ul className="list-disc pl-5">{p.rules.map((r) => <li key={r}>{r}</li>)}</ul></Card>
    )),
    FAQs: FAQS.filter(match).map((f) => <Card key={f.id} title={f.title}>{f.answer}</Card>),
    Escalation: ESCALATION.filter(match).map((e) => (
      <Card key={e.id} title={e.trigger} tag={`Send to: ${e.to}`}>{e.action}</Card>
    )),
  }[tab]

  return (
    <div className="space-y-4 p-4 md:p-6">
      <p className="inline-block rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-900">
        {KB_META.label} Last reviewed {KB_META.lastReviewed}.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <div role="tablist" aria-label="Knowledge base sections" className="flex gap-1">
          {TABS.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
              className={`rounded px-3 py-1.5 text-sm ${tab === t ? 'bg-charcoal-900 text-white' : 'text-charcoal-700 hover:bg-ivory-100'}`}>{t}</button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={16} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-500" />
          <input type="search" aria-label="Search knowledge base" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search this knowledge base" className="w-full rounded border border-ivory-200 bg-white py-2 pl-9 pr-3 text-sm" />
        </div>
      </div>
      {cards.length ? <div role="tabpanel" className="grid gap-3 md:grid-cols-2">{cards}</div>
        : <p className="text-sm text-charcoal-500">No entries match your search in {tab}.</p>}
    </div>
  )
}
