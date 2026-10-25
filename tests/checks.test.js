// Offline tests for server/checks.js. No server, no API key, no network needed.
// Run with: npm test   (or: node --test tests/)
import test from 'node:test'
import assert from 'node:assert/strict'
import { ruleChecks } from '../server/checks.js'
import { tickets } from '../src/data/tickets.js'

const ticket = (id) => tickets.find((t) => t.id === id)
const verdict = (t, reply, checkId) => ruleChecks(t, reply).find((c) => c.id === checkId).verdict

const joel = ticket('UT-1042') // condition dispute, escalate: true
const maria = ticket('UT-1041') // calm sizing question

test('unfilled [placeholders] fail', () => {
  assert.equal(verdict(maria, 'Insole is [VERIFY: length in cm].', 'placeholders'), 'fail')
  assert.equal(verdict(maria, 'Happy to help with sizing.', 'placeholders'), 'pass')
})

test('invented order numbers fail, real ones pass', () => {
  assert.equal(verdict(joel, 'About order UT-99999, thanks.', 'invented'), 'fail')
  assert.equal(verdict(joel, 'About order UT-88213, thanks.', 'invented'), 'pass')
})

test('invented tracking numbers fail', () => {
  assert.equal(verdict(joel, 'Your tracking number is JT8839201746.', 'invented'), 'fail')
  assert.equal(verdict(joel, 'Your tracking number is SAMPLE-TRK-0091.', 'invented'), 'pass')
})

test('prices match even when commas differ', () => {
  assert.equal(verdict(joel, 'You paid PHP 1450 for the loafers.', 'invented'), 'pass')
  assert.equal(verdict(joel, 'You paid PHP 2,999 for the loafers.', 'invented'), 'fail')
})

test('refund and guarantee promises warn', () => {
  assert.equal(verdict(joel, 'We will refund you today.', 'promises'), 'warn')
  assert.equal(verdict(joel, 'I guarantee it will fit.', 'promises'), 'warn')
  assert.equal(verdict(joel, 'A manager will review your case.', 'promises'), 'pass')
})

test('invented delivery dates warn, dates from the ticket do not', () => {
  assert.equal(verdict(joel, 'It should reach you by Oct 30.', 'promises'), 'warn')
  assert.equal(verdict(ticket('UT-1045'), 'Your order was delivered on Oct 22.', 'promises'), 'pass')
})

test('asking for card numbers or passwords fails', () => {
  assert.equal(verdict(maria, 'Please send your card number.', 'privacy'), 'fail')
  assert.equal(verdict(maria, 'Please never share your password with anyone.', 'privacy'), 'pass')
})

test('a negation in a DIFFERENT sentence must not hide a request for a card number', () => {
  assert.equal(verdict(maria, "Don't worry about it. Please send your card number.", 'privacy'), 'fail')
})

test('sensitive ticket without review language warns', () => {
  assert.equal(verdict(joel, 'Sorry about that. Enjoy your day.', 'escalation'), 'warn')
  assert.equal(verdict(joel, 'I will pass your case to a manager for review.', 'escalation'), 'pass')
})

test('calm ticket needs no escalation language', () => {
  assert.equal(verdict(maria, 'The insole is 26.5 cm.', 'escalation'), 'pass')
})
