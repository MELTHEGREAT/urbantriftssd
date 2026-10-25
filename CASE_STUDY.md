# Case study: Urban Trifts Support Desk

> A **fictional portfolio prototype**. The store, customers, orders and policies are invented. It is not a real product or business.

## The problem
Small online resale shops answer the same kinds of messages all day: sizing, condition, shipping delays, tracking, returns. Secondhand makes it harder, because every item is one of a kind, defects are disclosed per item, and a wrong promise (a refund, a delivery date, "it will fit") is costly. AI can draft replies quickly, but a draft that invents an order status or promises a refund is worse than no draft.

## The solution
A support dashboard where AI drafts and a human decides. The agent opens a ticket, generates a draft grounded in a small knowledge base, edits it, runs quality checks, and approves it. Sending is deliberately not built.

## The workflow
1. **Triage:** inbox with search and status filters; the agent sets priority and category and can escalate manually with a reason.
2. **Draft:** the server sends the ticket plus only the relevant knowledge base entries to the AI and gets back a reply, a list of things to verify, and an escalation recommendation.
3. **Edit:** the agent rewrites freely. Missing facts appear as `[VERIFY: ...]` placeholders.
4. **Check:** rule checks block obvious problems (unfilled placeholders, invented references, risky promises). An advisory AI review adds opinions, clearly labelled as such.
5. **Approve:** a human approves. Nothing is sent. Internal notes stay separate from the customer-facing text.

## Design decisions
- **Grounding over fluency:** the AI may only use the ticket and knowledge base. "I don't know" must look like `[VERIFY: ...]`, not a confident guess.
- **Two kinds of checking:** deterministic rules (traceable to text, testable offline) and an AI review (flexible, but advisory). The UI never presents the AI's opinion as a fact and never shows invented scores.
- **Escalation is a human decision:** the AI recommends; the agent's flag is separate and explicit.
- **Server-side AI only:** the key never reaches the browser; the server does not log ticket content.
- **Small and boring on purpose:** no database, no auth, localStorage persistence. It keeps the project understandable and the safeguards visible.

## What testing found
Writing offline tests for the rule checks exposed four real gaps that were then fixed: invented tracking codes were not detected, `PHP 1450` was wrongly flagged against `PHP 1,450`, invented delivery dates were not flagged, and one "don't" in a reply could excuse a request for a card number in another sentence. Scenario testing against a live model (9 cases including a prompt-injection attempt) is described in the README; **add the live results from `TESTING.md` here once you have run them**, including any failures.

## Limitations and next steps
No login, no database, no sending, and a small fictional knowledge base. Heuristic checks can miss things. Next: wire the placeholder pages, export a QA report, and only then consider sending with explicit approval and a real email service.
