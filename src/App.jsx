import { useEffect, useMemo, useState } from 'react'
import { tickets as sampleTickets } from './data/tickets'
import { requestDraft, requestReview } from './lib/aiClient'
import { loadState, saveState, clearState } from './lib/storage'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import StatCards from './components/StatCards'
import TicketList from './components/TicketList'
import TicketDetail from './components/TicketDetail'
import AiPanel from './components/AiPanel'
import QualityReview from './components/QualityReview'
import KnowledgeBase from './components/KnowledgeBase'
import PlaceholderPage from './components/PlaceholderPage'

const withDefaults = (t) => ({ notes: [], flagged: false, flagReason: '', ...t })
const fresh = () => ({ tickets: sampleTickets.map(withDefaults), drafts: {}, savedAt: {}, generated: {} })
const timeLabel = (iso) => new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

export default function App() {
  // Saved data wins; sample tickets are used only when nothing valid is stored.
  const [boot] = useState(() => loadState() ?? fresh())
  const [page, setPage] = useState('Overview')
  const [tickets, setTickets] = useState(boot.tickets)
  const [selectedId, setSelectedId] = useState(boot.tickets[0].id)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [drafts, setDrafts] = useState(boot.drafts) // live editor text
  const [savedDrafts, setSavedDrafts] = useState(boot.drafts) // text saved to storage
  const [savedAt, setSavedAt] = useState(boot.savedAt)
  const [generated, setGenerated] = useState(boot.generated)
  const [ai, setAi] = useState({}) // per-ticket AI status and result (not persisted)
  const [reviews, setReviews] = useState({}) // per-ticket review result (not persisted)
  const [approved, setApproved] = useState({}) // ticket id -> approved reply text
  const [notice, setNotice] = useState('')
  const [storageOk, setStorageOk] = useState(true)

  // Persist saved data whenever it changes. Unsaved typing is not written.
  useEffect(() => {
    setStorageOk(saveState({ tickets, drafts: savedDrafts, savedAt, generated }))
  }, [tickets, savedDrafts, savedAt, generated])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tickets.filter((t) =>
      (filter === 'All' || t.status === filter) &&
      (!q || [t.customer, t.subject, t.id, t.message].some((v) => v.toLowerCase().includes(q))))
  }, [tickets, query, filter])

  const selected = tickets.find((t) => t.id === selectedId) ?? tickets[0]
  const draft = drafts[selected.id] ?? ''
  const unsaved = draft !== (savedDrafts[selected.id] ?? '')
  const select = (id) => { setSelectedId(id); setNotice('') }

  const generate = async () => {
    const id = selected.id
    setAi((s) => ({ ...s, [id]: { status: 'loading' } }))
    setNotice('')
    try {
      const result = await requestDraft(selected)
      setAi((s) => ({ ...s, [id]: { status: 'done', result } }))
      setDrafts((d) => ({ ...d, [id]: result.reply }))
      setGenerated((g) => ({ ...g, [id]: true }))
      setNotice(result.mode === 'live' ? 'AI draft ready. Review and edit it. Select Save Draft to keep it.' : 'Mock draft loaded. No AI was called. Select Save Draft to keep it.')
    } catch (e) {
      setAi((s) => ({ ...s, [id]: { status: 'error', error: e.message } }))
    }
  }
  const runReview = async () => {
    const id = selected.id, text = draft
    setReviews((r) => ({ ...r, [id]: { status: 'loading' } }))
    try {
      const result = await requestReview(selected, text)
      setReviews((r) => ({ ...r, [id]: { status: 'done', result, text } }))
    } catch (e) {
      setReviews((r) => ({ ...r, [id]: { status: 'error', error: e.message } }))
    }
  }
  const approve = () => {
    setApproved((x) => ({ ...x, [selected.id]: draft }))
    setNotice('Reply approved (demo). You can now select Send Reply. No real email is sent.')
  }
  // Simulated send: records the approved reply in the conversation. No email is delivered.
  const canSend = approved[selected.id] === draft && draft.trim() !== '' && selected.status !== 'Resolved'
  const sendReply = () => {
    if (!canSend) return
    const id = selected.id, text = draft
    const entry = { from: 'agent', time: `Today, ${timeLabel(new Date().toISOString())}`, text }
    setTickets((all) => all.map((t) => (t.id === id ? { ...t, status: 'Pending', history: [...t.history, entry] } : t)))
    const without = (o) => Object.fromEntries(Object.entries(o).filter(([k]) => k !== id))
    setDrafts(without); setSavedDrafts(without); setSavedAt(without); setApproved(without); setReviews(without)
    setNotice(`Reply sent (demo). No email was delivered. ${id} is now Pending.`)
  }
  const saveDraft = () => {
    const now = new Date().toISOString()
    setSavedDrafts((d) => ({ ...d, [selected.id]: draft }))
    setSavedAt((s) => ({ ...s, [selected.id]: now }))
    setNotice(`Draft saved at ${timeLabel(now)} in this browser. Nothing was sent.`)
  }
  const resolve = () => {
    setTickets((all) => all.map((t) => (t.id === selected.id ? { ...t, status: 'Resolved' } : t)))
    setNotice(`${selected.id} marked as resolved and saved in this browser.`)
  }
  // Edit one field of the selected ticket (status, priority, category).
  const updateTicket = (changes) =>
    setTickets((all) => all.map((t) => (t.id === selected.id ? { ...t, ...changes } : t)))
  const setField = (field, value) => {
    updateTicket({ [field]: value })
    setNotice(`${selected.id} ${field} set to ${value}. Saved in this browser.`)
  }
  const setFlag = (on, reason) => {
    updateTicket({ flagged: on, flagReason: reason })
    setNotice(on ? `${selected.id} escalated for manager review. Saved in this browser.` : `Escalation removed from ${selected.id}.`)
  }
  const addNote = (text) => {
    const note = { id: `n${Date.now()}`, text, time: new Date().toISOString() }
    updateTicket({ notes: [...(selected.notes ?? []), note] })
    setNotice('Internal note added. It is not part of the reply.')
  }
  const deleteNote = (id) => {
    updateTicket({ notes: (selected.notes ?? []).filter((n) => n.id !== id) })
    setNotice('Internal note deleted.')
  }
  const resetDemo = () => {
    const f = fresh()
    clearState()
    setTickets(f.tickets); setDrafts({}); setSavedDrafts({}); setSavedAt({}); setGenerated({})
    setSelectedId(f.tickets[0].id); setQuery(''); setFilter('All')
    setNotice('Demo data reset to the original sample tickets.')
  }

  const showInbox = page === 'Overview' || page === 'Inbox'
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:bg-white focus:p-2">Skip to content</a>
      <Sidebar page={page} onNavigate={setPage} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={page} query={query} onQuery={setQuery} />
        <main id="main" className="flex-1">
          {showInbox ? (
            <div className="space-y-4 p-4 md:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <p className="rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-900">
                  Demo mode: fictional data. Changes are saved in this browser only. No emails are sent and no store is updated.
                </p>
                <button onClick={resetDemo} className="text-xs text-charcoal-700 underline underline-offset-2 hover:text-charcoal-900">Reset demo data</button>
              </div>
              {!storageOk && (
                <p role="alert" className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
                  Browser storage is unavailable, so changes will be lost when you refresh.
                </p>
              )}
              {page === 'Overview' && <StatCards tickets={tickets} />}
              <div className="grid gap-4 xl:grid-cols-[minmax(280px,340px)_minmax(0,1fr)_300px]">
                <TicketList tickets={visible} selectedId={selected.id} onSelect={select} filter={filter} onFilter={setFilter} />
                <TicketDetail ticket={selected} draft={draft} notice={notice} unsaved={unsaved} aiBusy={ai[selected.id]?.status === 'loading'} hasDraft={!!ai[selected.id]?.result}
                  savedLabel={savedAt[selected.id] ? timeLabel(savedAt[selected.id]) : ''}
                  onDraft={(v) => setDrafts((d) => ({ ...d, [selected.id]: v }))}
                  onGenerate={generate} onResolve={resolve} onSave={saveDraft} canSend={canSend} onSend={sendReply}
                  onField={setField} onFlag={setFlag} onAddNote={addNote} onDeleteNote={deleteNote} />
                <div className="flex flex-col gap-4">
                  <AiPanel ticket={selected} ai={ai[selected.id]} />
                  <QualityReview draft={draft} review={reviews[selected.id]} approvedText={approved[selected.id]} onRun={runReview} onApprove={approve} />
                </div>
              </div>
            </div>
          ) : page === 'Knowledge Base' ? (
            <KnowledgeBase />
          ) : (
            <PlaceholderPage title={page} />
          )}
        </main>
      </div>
    </div>
  )
}
