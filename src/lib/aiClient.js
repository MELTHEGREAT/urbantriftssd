// Sends one ticket to our own server. The server talks to the AI, not the browser.
export async function requestDraft(ticket) {
  const { id, customer, subject, message, category, priority, order, history } = ticket
  let res
  try {
    res = await fetch('/api/draft-reply', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ticket: { id, customer, subject, message, category, priority, order, history } }),
    })
  } catch {
    throw new Error('Cannot reach the API server. Start it with "npm run server".')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'The AI service returned an error.')
  return data
}

export async function requestReview(ticket, reply) {
  const { id, subject, message, category, order, history, escalate } = ticket
  let res
  try {
    res = await fetch('/api/review-reply', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ticket: { id, subject, message, category, order, history, escalate: escalate || ticket.flagged === true }, reply }),
    })
  } catch {
    throw new Error('Cannot reach the API server. Start it with "npm run server".')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'The review service returned an error.')
  return data
}
