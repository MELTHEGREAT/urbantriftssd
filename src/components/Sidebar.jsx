import { LayoutDashboard, Inbox, BookOpen, Sparkles, ClipboardCheck, Settings } from 'lucide-react'

export const NAV = [
  { id: 'Overview', icon: LayoutDashboard },
  { id: 'Inbox', icon: Inbox },
  { id: 'Knowledge Base', icon: BookOpen },
  { id: 'AI Reply Assistant', icon: Sparkles },
  { id: 'Quality Assurance', icon: ClipboardCheck },
  { id: 'Settings', icon: Settings },
]

export default function Sidebar({ page, onNavigate }) {
  return (
    <aside className="flex shrink-0 flex-col bg-charcoal-900 text-ivory-100 md:w-60">
      <div className="flex items-baseline px-5 py-4 md:py-6">
        <span className="font-display text-xl tracking-tight">Urban Trifts</span>
        <span className="ml-2 text-xs text-ivory-200/60">Support Desk</span>
      </div>
      <nav aria-label="Main" className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:pb-0">
        {NAV.map(({ id, icon: Icon }) => {
          const active = page === id
          return (
            <button key={id} onClick={() => onNavigate(id)} aria-current={active ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-2.5 rounded px-3 py-2 text-sm ${active ? 'bg-charcoal-700 text-white' : 'text-ivory-200/75 hover:bg-charcoal-800 hover:text-white'}`}>
              <Icon size={16} aria-hidden="true" /> {id}
            </button>
          )
        })}
      </nav>
      <p className="hidden px-5 py-4 text-xs text-ivory-200/50 md:block">Stage 1 demo. Fictional data.</p>
    </aside>
  )
}
