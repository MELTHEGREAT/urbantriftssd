# Urban Trifts Support Desk: Handoff and Continuation Guide

Give this file to any AI assistant or developer to continue the project. Read it fully before changing code.

## 1. What this is
A portfolio prototype: an internal customer-support dashboard for **Urban Trifts**, a FICTIONAL secondhand-shoe store. A human agent opens a ticket, generates an AI draft grounded in a knowledge base, reviews and edits it, runs quality checks, and manages the ticket. The AI assists. It never sends anything. All data is fictional.

Owner is a beginner developer: prefer simple, maintainable code and beginner-friendly explanations.

## 2. Stack
React + Vite + JavaScript, Tailwind CSS v3, lucide-react, Express (backend). No database, no auth, no email.
AI providers (switch in `.env`): Gemini free tier (`gemini`), Claude API (`anthropic`, paid), or `mock`.

## 3. Status (as of Phase 7 docs; nothing deployed)
| Area | Status |
|---|---|
| Dashboard, sidebar, inbox, ticket details, search, status filters | Working |
| Reply editor, Save Draft, Mark as Resolved, localStorage persistence | Working (tested) |
| Knowledge Base page (products, grading, policies, FAQs, escalation) | Working, fictional data |
| Server `/api/draft-reply` (Gemini/Claude/mock), validation, rate limit, error handling | Built. Live Gemini reply NOT yet verified by the owner |
| Quality review: rule-based checks + advisory AI review + human approval | Built. Rule checks tested. AI review NOT yet tested live |
| Settings, AI Reply Assistant, Quality Assurance sidebar pages | Placeholders |
| Status dropdown (incl. Pending), editable priority/category, internal notes, manual escalation flag with reason | Built in Phase 5. Written but NOT yet build-tested by the owner |
| Offline tests for checks.js (`npm test`, 10 tests) | Passing. 4 weaknesses found and fixed in checks.js (tracking-code detection, price formatting, invented dates, negation across sentences) |
| Scenario runner (`npm run test:scenarios`, writes TESTING.md) | Built and verified against a stub server only. NOT yet run against a live model by the owner |
| README, CASE_STUDY.md, DEPLOYMENT.md (options and costs), server can serve built app | Written. Not deployed. Not build-tested (no npm in my workspace) |
| Screenshots | NOT done: owner takes them using docs/screenshots/SHOTLIST.md |
| Sending replies / email, auth, database, Shopify | Intentionally NOT built |

## 4. File map
- `src/App.jsx`: main state (tickets, drafts, AI results, reviews, approvals) and layout.
- `src/data/tickets.js`: 8 fictional tickets. `src/data/knowledgeBase.js`: ALL store info plus `sourcesFor(category)`. Edit store info only here.
- `src/lib/storage.js`: safe localStorage (key `urbanTrifts.supportDesk.v1`, validates saved tickets). `src/lib/aiClient.js`: calls our server.
- `src/components/`: Sidebar, TopBar, StatCards, TicketList, TicketDetail, AiPanel, QualityReview, KnowledgeBase, Badges, PlaceholderPage.
- `server/index.js`: Express API (`/api/health`, `/api/draft-reply`, `/api/review-reply`), prompts, provider calls. `server/checks.js`: rule-based reply checks.
- `vite.config.js` proxies `/api` to `localhost:8787`.

## 5. Run it
1. `npm install`  2. copy `.env.example` to `.env` (add `GEMINI_API_KEY` from aistudio.google.com for real AI; blank = mock mode)
3. Terminal 1: `npm run server`  4. Terminal 2: `npm run dev`  5. open http://localhost:5173
Both terminals must stay open. `http://localhost:8787/` showing "Cannot GET /" is normal. Check `/api/health`.
If Gemini returns `provider_404`, set `GEMINI_MODEL` to a current model name from AI Studio. `.env` is never zipped or committed; re-create it on a new machine.

## 6. Rules that must be kept
- Do not rebuild or restyle the dashboard (charcoal, warm ivory, white, muted green; Fraunces + Instrument Sans). Change design only when needed.
- Never put API keys in React code or client-side env vars. Keys stay in server `.env`.
- AI must not invent order status, tracking numbers, inventory, refunds, dates or policy exceptions. Missing facts become `[VERIFY: ...]`.
- Sensitive cases (refunds, disputes, damage, fraud, legal, angry customers) are flagged for human review.
- Human approval is required before any reply could be sent. No sending exists.
- Do not log customer content on the server. Use fictional data only.
- Do not claim a feature is complete unless built AND checked. Do not present AI opinions as verified facts or invent scores.
- Work in small steps. Run `npm run build` after each change. Tell the owner which files changed and whether `npm install` is needed.
- Free Gemini tier: prompts may be used by Google, rate limits apply (a 429 shows a friendly message). Never send real customer data.

## 7. Next phases (paste-ready tasks)

### Phase 5: Improve ticket workflow
"Read HANDOFF.md. Inspect the code, then add: (1) editable priority and category per ticket, (2) internal notes per ticket (clearly separate from customer-facing text), (3) a manual escalation flag with a reason, (4) a Pending status option and status dropdown, (5) clear empty states and confirmation messages. Persist everything in localStorage via src/lib/storage.js (extend validation, keep old saved data from crashing the app). Keep the existing design. Build and test; list changed files."

### Phase 6: Testing and reliability
"Read HANDOFF.md. Create a test script or checklist covering: sizing question, disclosed defect, shipping/tracking with missing info, refund request, angry damaged-item complaint, unavailable product, unclear message, AI service failure. Run each through /api/draft-reply and /api/review-reply (live key if available). Record results in TESTING.md: what the AI produced, whether it invented facts, whether escalation was flagged. Fix prompt or checks.js problems found. Do not hide failures."

### Phase 7: Portfolio and deployment
"Read HANDOFF.md. Write a professional README (setup, env vars, architecture diagram, features, known limitations, test scenarios), add screenshots, and a short case study (problem, solution, workflow, safeguards) clearly labelled a fictional portfolio prototype. Explain free-tier hosting options and costs before deploying: frontend on Vercel or Netlify, backend on Render or similar. Keys go in the host's environment settings only."

### Optional later
Wire the AI Reply Assistant / Quality Assurance / Settings pages; export a QA report; automatic sending only with explicit approval and a real email service.

## 8. Starter prompt for a NEW account or AI tool
"You are a senior full-stack developer helping a beginner finish the Urban Trifts Support Desk portfolio project. I am attaching the project files. First read HANDOFF.md, inspect the real code, and give a short audit of what works. Then do only the phase I name. Follow section 6 rules. After each change run the build, list changed files, say whether npm install is needed, and explain how I can test it in simple steps."

## 9. Protect your work
- Keep the latest full zip somewhere safe (cloud drive). Use `git init`, `git add .`, `git commit -m "phase 4"`, and push to a private GitHub repo. `.gitignore` already excludes `.env` and `node_modules`.
- Tools that edit files in your own folder (such as Claude Code) avoid the zip-and-copy routine. Other AI assistants can continue from this file too, but check their output with `npm run build`.
