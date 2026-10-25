// Rule-based reply checks. No AI involved: every verdict can be traced to text in the reply.
const PROMISE = /\b(we will refund|i will refund|will be refunded|full refund|guarantee[sd]?|definitely|100%|will arrive (by|on)|replacement (will be|is) sent|we will replace)\b/i
const SENSITIVE_ASK = /\b(password|card number|cvv|otp)\b/i
const NEGATED = /\b(never|do not|don't|don\u2019t|please don't|won't|won\u2019t)\b/i
const DATE_PROMISE = /\b(?:by|before|on)\s+((?:mon|tue|tues|wed|thu|thur|thurs|fri|sat|sun)(?:day)?\b|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2})\b/gi
const IDLIKE = /\b(?=[A-Z0-9-]*\d)(?=[A-Z0-9-]*[A-Z])[A-Z0-9-]{8,}\b/g
const RISKY_TOPIC = /(refund|compensat|damag|broken|not as described|fraud|chargeback|lawyer|legal|scam|furious|unacceptable|never (arrived|received)|missing)/i
const SETS_EXPECTATION = /(manager|team|review|escalat|pass(ed|ing)? (this|your)|look into|investigat|check with)/i

export function ruleChecks(t, reply) {
  const out = []
  const add = (id, label, verdict, note) => out.push({ id, label, verdict, note })
  const known = JSON.stringify({ s: t.subject, m: t.message, o: t.order, h: t.history }).toLowerCase()

  const holes = reply.match(/\[[^\]]{2,80}\]/g) ?? []
  holes.length
    ? add('placeholders', 'Placeholders filled', 'fail', `Replace or remove ${holes.length} placeholder(s) with verified facts: ${holes.slice(0, 3).join(', ')}`)
    : add('placeholders', 'Placeholders filled', 'pass', 'No unfilled [brackets] found.')

  // Order numbers and tracking-like codes (letters plus digits) that are not in the ticket.
  const idMatches = new Set([...(reply.match(/\b[A-Z]{2,}(?:-[A-Z]+)*-\d{3,}\b/g) ?? []), ...(reply.match(IDLIKE) ?? [])])
  const ids = [...idMatches].filter((x) => !known.includes(x.toLowerCase()))
  // Compare prices ignoring spaces and commas, so "PHP 1450" matches "PHP 1,450".
  const squash = (x) => x.toLowerCase().replace(/[\s,]/g, '')
  const knownSquashed = squash(known)
  const prices = (reply.match(/PHP\s?[\d,]*\d/gi) ?? []).filter((x) => !knownSquashed.includes(squash(x)))
  ids.length || prices.length
    ? add('invented', 'No invented references', 'fail', `Not found in the ticket data: ${[...ids, ...prices].join(', ')}. Verify before sending.`)
    : add('invented', 'No invented references', 'pass', 'Order numbers, tracking IDs and prices in the reply match the ticket.')

  const promise = reply.match(PROMISE)
  const invented = [...reply.matchAll(DATE_PROMISE)].find((m) => !known.includes(m[1].toLowerCase()))
  const flagged = promise?.[0] ?? invented?.[0]
  flagged
    ? add('promises', 'No unapproved promises', 'warn', `"${flagged}" may commit the store to something agents cannot approve or a date that is not in the ticket. Confirm it is allowed.`)
    : add('promises', 'No unapproved promises', 'pass', 'No refund, guarantee or delivery-date promises detected.')

  // Judge each sentence on its own, so a "don't" in one sentence cannot excuse another.
  const asksForSecrets = reply.split(/(?<=[.!?])\s+/).some((sent) => SENSITIVE_ASK.test(sent) && !NEGATED.test(sent))
  asksForSecrets
    ? add('privacy', 'Privacy', 'fail', 'The reply seems to ask for a password, card number or code. Remove it.')
    : add('privacy', 'Privacy', 'pass', 'No request for passwords or payment details.')

  const customerText = [t.message, ...t.history.filter((m) => m.from === 'customer').map((m) => m.text)].join(' ')
  const needsHuman = t.escalate === true || RISKY_TOPIC.test(customerText)
  needsHuman && !SETS_EXPECTATION.test(reply)
    ? add('escalation', 'Escalation handled', 'warn', 'This case looks sensitive but the reply does not say it is being reviewed. Escalate it and set that expectation.')
    : add('escalation', 'Escalation handled', 'pass', needsHuman ? 'Reply tells the customer the case is being reviewed. Still escalate internally.' : 'No sensitive topic detected.')
  return out
}
