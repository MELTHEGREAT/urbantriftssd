// Fictional sample data only. No real customers, orders, or policies.
export const CATEGORIES = ['Sizing', 'Product condition', 'Shipping delay', 'Tracking', 'Returns', 'Availability']
export const STATUSES = ['Open', 'Pending', 'Resolved']
export const PRIORITIES = ['High', 'Medium', 'Low']

const SOURCES = ['[POLICY: returns policy, not yet verified]', 'Order record (sample)', 'Product listing (sample)']

export const tickets = [
  {
    id: 'UT-1041', customer: 'Maria Santos', subject: 'Does the size 8 boot run small?',
    message: "Hi! I'm eyeing the size 8 black boots in your shop. I usually wear a 9 in sneakers. Will the 8 fit, or should I wait for a bigger one?",
    category: 'Sizing', priority: 'Low', status: 'Open', received: 'Today, 8:40 AM', escalate: false,
    order: { number: 'None yet (pre-sale)', items: 'Black leather boots, listed US 8', total: '-', shipping: '-', tracking: '-' },
    history: [{ from: 'customer', time: 'Today, 8:40 AM', text: "Hi! I'm eyeing the size 8 black boots..." }],
    reply: "Hi Maria, thanks for asking. This pair is listed as US 8, and the insole measures [VERIFY: insole length in cm]. Since you wear a 9 in sneakers, it may be snug, but I'd rather you check the measurement than guess. Want me to send the size guide?",
    checklist: ['Insole length confirmed on listing', 'Pair still available', 'Sizing guidance matches listing'],
    escalation: 'No escalation needed. Do not guarantee fit.',
  },
  {
    id: 'UT-1042', customer: 'Joel Reyes', subject: 'Heel looks more worn than the photos',
    message: "My loafers arrived yesterday. The heel is more worn than the photos showed. I'm not sure it's what I paid for. What can you do?",
    category: 'Product condition', priority: 'High', status: 'Open', received: 'Today, 7:15 AM', escalate: true,
    order: { number: 'UT-88213', items: 'Brown leather loafers, US 9', total: 'PHP 1,450 (sample)', shipping: 'Delivered Oct 25', tracking: 'SAMPLE-TRK-0091' },
    history: [
      { from: 'customer', time: 'Yesterday, 6:02 PM', text: 'Received the loafers, heel wear looks heavier than photos.' },
      { from: 'customer', time: 'Today, 7:15 AM', text: "I'm not sure it's what I paid for. What can you do?" },
    ],
    reply: "Hi Joel, sorry the heel wear isn't what you expected. Could you send a clear photo of the heel and sole? I'll pass your case to [Role] to review against the listing. I can't confirm a remedy yet.",
    checklist: ['Compare customer photo with listing photos', 'Check condition grade on listing', '[POLICY: remedy for condition disputes] confirmed'],
    escalation: 'Recommended: condition dispute with possible refund. Needs manager review.',
  },
  {
    id: 'UT-1043', customer: 'Aileen Cruz', subject: 'Order not shipped after 6 days',
    message: 'I ordered last Monday and it still says processing. Is something wrong? I need it for an event this weekend.',
    category: 'Shipping delay', priority: 'High', status: 'Open', received: 'Yesterday, 4:20 PM', escalate: false,
    order: { number: 'UT-88190', items: 'White canvas sneakers, US 6', total: 'PHP 980 (sample)', shipping: 'Processing', tracking: 'Not yet assigned' },
    history: [{ from: 'customer', time: 'Yesterday, 4:20 PM', text: 'I ordered last Monday and it still says processing.' }],
    reply: "Hi Aileen, order UT-88190 is still in processing. [POLICY: standard processing time] is our usual window, and I'm checking with fulfillment on yours. I'll update you by [Follow-Up Date]. I can't promise arrival before your event yet.",
    checklist: ['Order status in system', 'Processing time vs. policy', 'Fulfillment contacted'],
    escalation: 'Escalate to fulfillment if processing exceeds [POLICY: threshold].',
  },
  {
    id: 'UT-1044', customer: 'Ramon Dela Cruz', subject: 'Tracking says delivered, nothing arrived',
    message: 'The courier app says delivered yesterday at 2 PM. Nobody here received it. Please help.',
    category: 'Tracking', priority: 'High', status: 'Pending', received: 'Oct 25, 10:05 AM', escalate: true,
    order: { number: 'UT-88154', items: 'Running shoes, US 10', total: 'PHP 1,200 (sample)', shipping: 'Marked delivered Oct 24', tracking: 'SAMPLE-TRK-0077' },
    history: [
      { from: 'customer', time: 'Oct 25, 10:05 AM', text: 'Courier app says delivered yesterday. Nothing arrived.' },
      { from: 'agent', time: 'Oct 25, 11:30 AM', text: 'Thanks, Ramon. Could you check with neighbors or household members while I look into this?' },
      { from: 'customer', time: 'Oct 25, 6:48 PM', text: 'Checked. Nobody has it.' },
    ],
    reply: "Thanks for checking, Ramon. I'm opening a carrier investigation for order UT-88154 and will update you by [Follow-Up Date]. [POLICY: remedy for missing parcels] will be confirmed once the carrier responds.",
    checklist: ['Delivery address matches order', 'Carrier scan details reviewed', 'Neighbor check done by customer'],
    escalation: 'Recommended: parcel marked delivered but missing. Needs carrier claim approval.',
  },
  {
    id: 'UT-1045', customer: 'Bea Lim', subject: 'Return a pair that is too tight',
    message: "The sneakers are a size too small. Can I return or exchange them? I haven't worn them outside.",
    category: 'Returns', priority: 'Medium', status: 'Open', received: 'Oct 25, 9:12 AM', escalate: false,
    order: { number: 'UT-88101', items: 'Grey retro sneakers, US 7', total: 'PHP 1,100 (sample)', shipping: 'Delivered Oct 22', tracking: 'SAMPLE-TRK-0050' },
    history: [{ from: 'customer', time: 'Oct 25, 9:12 AM', text: 'The sneakers are a size too small...' }],
    reply: "Hi Bea, thanks for letting me know. Your order was delivered on Oct 22, so I'm checking it against [POLICY: return window and conditions]. If it qualifies, I'll send return steps. I can't confirm an exchange until I've checked stock for US 8.",
    checklist: ['Delivery date vs. return window', 'Item condition matches policy', 'Replacement size in stock'],
    escalation: 'No escalation unless outside the return window.',
  },
  {
    id: 'UT-1046', customer: 'Carlo Mendoza', subject: 'Is the denim jacket still available?',
    message: "Saw the denim jacket in last week's drop. Is it still available in size M? Can you hold it for me?",
    category: 'Availability', priority: 'Low', status: 'Pending', received: 'Oct 24, 2:30 PM', escalate: false,
    order: { number: 'None (pre-sale)', items: 'Vintage denim jacket, size M', total: '-', shipping: '-', tracking: '-' },
    history: [
      { from: 'customer', time: 'Oct 24, 2:30 PM', text: 'Is the denim jacket still available in M? Can you hold it?' },
      { from: 'agent', time: 'Oct 24, 3:10 PM', text: 'Checking our listing now and will confirm shortly.' },
    ],
    reply: "Hi Carlo, I checked the listing: [VERIFY: still available or sold]. Unique thrift items sell quickly. Whether I can hold it depends on [POLICY: hold rules], so I can't promise that yet.",
    checklist: ['Live listing status', 'Hold policy confirmed', 'Variant is size M'],
    escalation: 'No escalation needed.',
  },
  {
    id: 'UT-1047', customer: 'Nina Villanueva', subject: 'Tracking number does not work',
    message: "I got a tracking number but the courier site says 'not found'. Is the link broken?",
    category: 'Tracking', priority: 'Medium', status: 'Open', received: 'Oct 24, 11:45 AM', escalate: false,
    order: { number: 'UT-88140', items: 'Beige platform sandals, US 7', total: 'PHP 890 (sample)', shipping: 'Label created Oct 24', tracking: 'SAMPLE-TRK-0102' },
    history: [{ from: 'customer', time: 'Oct 24, 11:45 AM', text: "The courier site says 'not found'." }],
    reply: "Hi Nina, thanks for flagging. Tracking can take [POLICY: activation time] to show updates after a label is made, and order UT-88140 shows a label created on Oct 24. If it still doesn't work by [Date], reply and I'll check with the courier.",
    checklist: ['Tracking number matches order', 'Label creation date', 'Courier name correct'],
    escalation: 'Escalate if no courier scan after [POLICY: days].',
  },
  {
    id: 'UT-1048', customer: 'Paolo Garcia', subject: 'Thanks, exchange arrived fine',
    message: 'Just confirming the replacement pair arrived and fits. Thanks for sorting it out.',
    category: 'Returns', priority: 'Low', status: 'Resolved', received: 'Oct 23, 5:05 PM', escalate: false,
    order: { number: 'UT-88077', items: 'Black chelsea boots, US 9 (exchange)', total: 'PHP 1,600 (sample)', shipping: 'Delivered Oct 23', tracking: 'SAMPLE-TRK-0033' },
    history: [{ from: 'customer', time: 'Oct 23, 5:05 PM', text: 'Replacement arrived and fits. Thanks!' }],
    reply: 'Glad it worked out, Paolo. Reply any time if something comes up.',
    checklist: ['Exchange delivered', 'Customer confirmed fit'],
    escalation: 'None.',
  },
].map((t) => ({ ...t, sources: SOURCES }))
