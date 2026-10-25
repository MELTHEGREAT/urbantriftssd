import { Search, Bell } from 'lucide-react'

export default function TopBar({ title, query, onQuery }) {
  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-ivory-200 bg-white px-4 py-3 md:px-6">
      <h1 className="mr-auto font-display text-xl">{title}</h1>
      <div className="relative order-last w-full sm:order-none sm:w-72">
        <Search size={16} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-500" />
        <input type="search" aria-label="Search tickets" value={query} onChange={(e) => onQuery(e.target.value)}
          placeholder="Search customer, subject, ticket ID"
          className="w-full rounded border border-ivory-200 bg-ivory-50 py-2 pl-9 pr-3 text-sm placeholder:text-charcoal-500" />
      </div>
      <button aria-label="Notifications (demo, none new)" className="rounded border border-ivory-200 p-2 text-charcoal-700 hover:bg-ivory-100">
        <Bell size={16} aria-hidden="true" />
      </button>
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-moss-600 text-xs font-semibold text-white">DA</span>
        <div className="hidden text-xs leading-tight sm:block">
          <p className="font-medium">Demo Agent</p>
          <p className="text-charcoal-500">Support</p>
        </div>
      </div>
    </header>
  )
}
