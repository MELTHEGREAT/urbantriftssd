import { useState } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, ShieldCheck, Loader2 } from 'lucide-react'

const V = {
  pass: [CheckCircle2, 'Pass', 'text-moss-700'],
  warn: [AlertTriangle, 'Check', 'text-amber-800'],
  fail: [XCircle, 'Fix', 'text-red-800'],
  unclear: [HelpCircle, 'Unclear', 'text-charcoal-500'],
}

const Row = ({ c }) => {
  const [Icon, word, cls] = V[c.verdict]
  return (
    <li className="py-1.5 text-sm">
      <p className={`flex items-center gap-1.5 font-medium ${cls}`}><Icon size={14} aria-hidden="true" /> {word}: <span className="text-charcoal-900">{c.label}</span></p>
      <p className="pl-5 text-charcoal-700">{c.note}</p>
    </li>
  )
}

export default function QualityReview({ draft, review, approvedText, onRun, onApprove }) {
  const [read, setRead] = useState(false)
  const result = review?.result
  const stale = result && review.text !== draft
  const all = result ? [...result.rule, ...(result.ai ?? [])] : []
  const verdict = !result ? null : all.some((c) => c.verdict === 'fail') ? 'fail' : all.some((c) => c.verdict !== 'pass') ? 'review' : 'clear'
  const approved = approvedText !== undefined && approvedText === draft && draft !== ''
  const canApprove = result && !stale && verdict !== 'fail' && read && !approved

  return (
    <section aria-label="Quality review" className="flex flex-col gap-3 border border-ivory-200 bg-white p-4 md:p-5">
      <h2 className="font-display text-lg">Quality review</h2>
      <p className="text-xs text-charcoal-500">Checks the reply in the editor. Results help you review. They do not prove the reply is correct.</p>
      <button onClick={onRun} disabled={!draft.trim() || review?.status === 'loading'}
        className="inline-flex items-center justify-center gap-1.5 rounded border border-charcoal-500 px-3 py-2 text-sm hover:bg-ivory-100 disabled:opacity-40">
        {review?.status === 'loading' ? <><Loader2 size={15} className="animate-spin" aria-hidden="true" /> Reviewing...</> : <><ShieldCheck size={15} aria-hidden="true" /> Review reply</>}
      </button>
      {!draft.trim() && <p className="text-sm text-charcoal-500">Write or generate a reply first.</p>}
      <div role="status" aria-live="polite">
        {review?.status === 'error' && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-900">{review.error}</p>}
      </div>

      {result && (
        <>
          {stale && <p className="rounded border border-amber-300 bg-amber-50 p-2 text-sm text-amber-900">The reply changed since this review. Run it again.</p>}
          <p className={`rounded border p-2 text-sm font-medium ${verdict === 'fail' ? 'border-red-200 bg-red-50 text-red-900' : verdict === 'review' ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-moss-600/40 bg-moss-100 text-moss-700'}`}>
            {verdict === 'fail' ? 'Do not use yet: fix the items marked Fix.' : verdict === 'review' ? 'Needs your judgment: look at the items marked Check or Unclear.' : 'No issues found by these checks. Read the reply yourself before approving.'}
          </p>
          <div>
            <h3 className="text-sm font-semibold">Automatic checks (rule-based)</h3>
            <ul className="divide-y divide-ivory-200">{result.rule.map((c) => <Row key={c.id} c={c} />)}</ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">AI review (advisory)</h3>
            {result.ai ? <ul className="divide-y divide-ivory-200">{result.ai.map((c) => <Row key={c.id} c={c} />)}</ul> : null}
            <p className="text-xs text-charcoal-500">{result.aiNote}</p>
          </div>
          <div className="border-t border-ivory-200 pt-3">
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={read} onChange={(e) => setRead(e.target.checked)} className="mt-1 accent-moss-600" />
              I read this reply and checked it against the sources.
            </label>
            <button onClick={() => { onApprove(); setRead(false) }} disabled={!canApprove}
              className="mt-2 rounded bg-moss-600 px-3 py-2 text-sm text-white hover:bg-moss-700 disabled:opacity-40">Approve reply</button>
            {approved && <p className="mt-2 text-sm text-moss-700">Approved by agent (demo). Use Send Reply (demo) to record it. No real email is sent. Editing the reply removes approval.</p>}
          </div>
        </>
      )}
    </section>
  )
}
