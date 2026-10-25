// FICTIONAL DEMO DATA. Urban Trifts is not a real store. Every product, price,
// policy and number below is invented for a portfolio prototype.
// To update the knowledge base, edit this file only. The UI reads from it.

export const KB_META = {
  label: 'Fictional demo data. Not real business information.',
  lastReviewed: '2026-10-26',
}

export const GRADING = {
  id: 'grading', title: 'Condition grading',
  items: [
    { grade: 'A', name: 'Like new', note: 'No visible wear. Light insole marks at most.' },
    { grade: 'B', name: 'Gently worn', note: 'Minor creasing or light sole wear. Fully wearable.' },
    { grade: 'C', name: 'Visible wear', note: 'Noticeable wear, scuffs or repairs. Defects are listed per item.' },
  ],
}

export const PRODUCTS = [
  { id: 'UT-P101', name: 'Black leather boots', size: 'US 8', insole: '26.5 cm', grade: 'B', price: 'PHP 1,800', status: 'Available', defects: ['Light creasing at the toe box'] },
  { id: 'UT-P102', name: 'Brown leather loafers', size: 'US 9', insole: '27.5 cm', grade: 'C', price: 'PHP 1,450', status: 'Sold', defects: ['Heel wear on both shoes, disclosed in listing photo 4', 'Re-glued left sole edge'] },
  { id: 'UT-P103', name: 'White canvas sneakers', size: 'US 6', insole: '24.5 cm', grade: 'A', price: 'PHP 980', status: 'Sold', defects: [] },
  { id: 'UT-P104', name: 'Running shoes', size: 'US 10', insole: '28.5 cm', grade: 'B', price: 'PHP 1,200', status: 'Sold', defects: ['Light midsole scuffing'] },
  { id: 'UT-P105', name: 'Grey retro sneakers', size: 'US 7', insole: '25.5 cm', grade: 'B', price: 'PHP 1,100', status: 'Sold', defects: [] },
  { id: 'UT-P106', name: 'Vintage denim jacket', size: 'M', insole: 'n/a', grade: 'B', price: 'PHP 1,350', status: 'Sold', defects: ['Faded left cuff'] },
  { id: 'UT-P107', name: 'Beige platform sandals', size: 'US 7', insole: '25.5 cm', grade: 'A', price: 'PHP 890', status: 'Sold', defects: [] },
  { id: 'UT-P108', name: 'Black chelsea boots', size: 'US 9', insole: '27.5 cm', grade: 'B', price: 'PHP 1,600', status: 'Available', defects: ['Minor scuff on right heel'] },
]

export const POLICIES = [
  { id: 'policy-shipping', title: 'Shipping and processing', rules: [
    'Orders are processed within 3 business days. (demo)',
    'Delivery takes 2 to 7 business days depending on region. (demo)',
    'Delays beyond 5 business days of processing go to fulfillment for review.',
  ] },
  { id: 'policy-tracking', title: 'Order tracking', rules: [
    'A tracking number is emailed once the courier scans the parcel. (demo)',
    'Tracking may take up to 24 hours to show updates after the label is made. (demo)',
    'Parcels marked delivered but not received need a courier investigation. Agents cannot promise a remedy.',
  ] },
  { id: 'policy-returns', title: 'Returns and exchanges', rules: [
    'Returns are accepted within 7 days of delivery for unworn items. (demo)',
    'Defects disclosed in the listing are not grounds for return.',
    'Sale items are final sale unless the item is not as described. (demo)',
  ] },
  { id: 'policy-refunds', title: 'Refunds', rules: [
    'Approved refunds go to the original payment method within 5 to 10 business days. (demo)',
    'Agents cannot approve refunds. All refund decisions go to a manager.',
  ] },
  { id: 'policy-cancel', title: 'Order cancellation', rules: [
    'Orders can be cancelled before they are packed. (demo)',
    'Shipped orders cannot be cancelled. Use the return process after delivery.',
  ] },
]

export const FAQS = [
  { id: 'faq-sizing', title: 'How do I choose a size?', answer: 'Each listing shows the US size and insole length. Compare the insole length with your foot. Secondhand shoes can fit differently from new ones, so fit is never guaranteed.' },
  { id: 'faq-hold', title: 'Can you hold an item for me?', answer: 'We do not hold items. Every piece is one of a kind and sells on a first-paid basis. (demo)' },
  { id: 'faq-processing', title: 'Why is my order still processing?', answer: 'Orders are packed within 3 business days. Check the date you ordered against that window before replying. (demo)' },
  { id: 'faq-condition', title: 'How accurate are the condition grades?', answer: 'Grades A, B and C are assigned by our team, and known defects are listed on each item. Photos are of the actual pair.' },
]

export const ESCALATION = [
  { id: 'esc-refund', trigger: 'Customer requests a refund or compensation', action: 'Collect order number and photos. Do not promise an outcome.', to: 'Manager' },
  { id: 'esc-condition', trigger: 'Item condition disputed or not as described', action: 'Compare customer photos with the listing. Pass both to review.', to: 'Manager' },
  { id: 'esc-missing', trigger: 'Parcel marked delivered but not received', action: 'Confirm address, ask the customer to check with household. Open a courier claim.', to: 'Fulfillment' },
  { id: 'esc-fraud', trigger: 'Suspected fraud, chargeback or legal threat', action: 'Stop using templates. Do not discuss account or payment details.', to: 'Owner' },
]

// Which knowledge-base entries support which ticket category.
const CATEGORY_SOURCES = {
  Sizing: ['faq-sizing', 'grading'],
  'Product condition': ['grading', 'faq-condition', 'policy-returns', 'esc-condition'],
  'Shipping delay': ['policy-shipping', 'faq-processing'],
  Tracking: ['policy-tracking', 'esc-missing'],
  Returns: ['policy-returns', 'policy-refunds'],
  Availability: ['faq-hold'],
}

const ALL = [GRADING, ...POLICIES, ...FAQS, ...ESCALATION.map((e) => ({ ...e, title: e.trigger }))]
export const kbEntry = (id) => ALL.find((e) => e.id === id)

export const sourcesFor = (category) =>
  (CATEGORY_SOURCES[category] ?? []).map(kbEntry).filter(Boolean).map(({ id, title }) => ({ id, title }))
