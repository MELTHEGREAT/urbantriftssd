# Deployment options and costs (read before deploying)

Nothing has been deployed. Terms below were checked on 2026-10-26 and change often; confirm on each host's pricing page before you sign up.

## Recommended for this project: one free Render web service
The server can serve the built React app itself (it does this automatically when a `dist/` folder exists), so one service runs everything. One place for keys, no cross-site settings.

**Cost:** $0. Per [Render's free-tier docs](https://render.com/docs/free):
- A free service **spins down after 15 minutes without traffic**; the next visit takes **about one minute** to wake up. Fine for a portfolio, but tell reviewers the first load is slow.
- 750 free instance hours per month; if they run out, free services are suspended until next month.
- Free bandwidth and build minutes are limited. Without a payment method, Render suspends instead of charging; with one, going over can be billed.
- No persistent disk (not needed: data is in the visitor's browser).

**Steps (when you are ready):**
1. Push the project to a private GitHub repo (`.env` is already git-ignored).
2. On Render: New > Web Service > pick the repo.
3. Build command: `npm install --include=dev && npm run build`. Start command: `npm run server`.
4. Environment tab: add `AI_PROVIDER=gemini`, `GEMINI_API_KEY=...`, `GEMINI_MODEL=...`, `TRUST_PROXY=1`. Keys go here only, never in the code or the repo.
5. Open the `onrender.com` URL and check `/api/health`.

## Alternative: split frontend and backend
Frontend on Vercel or Netlify, backend on Render. More moving parts: the frontend calls `/api/...` on its own address, so you need a rewrite rule to forward `/api/*` to the Render URL (or code changes), and you manage two services.
- **Vercel Hobby:** free, but per its [plan page](https://vercel.com/docs/plans/hobby) it is for **non-commercial, personal use only**. A portfolio is fine; a real business is not. Includes 100 GB Fast Data Transfer and 1,000,000 function invocations per month.
- **Netlify:** has a free plan; I did not verify its current limits, so check [netlify.com/pricing](https://www.netlify.com/pricing/).

## Costs that are not hosting
- **Gemini free tier:** $0, but rate-limited, and Google may use prompts to improve its products. Fine for fictional data only.
- **Claude API (`anthropic` provider):** paid per use. Only switch if you accept that cost.
- **Custom domain:** optional, roughly a few dollars to $15 per year from a registrar. Not needed.

## Risks to decide on before going public
- **Anyone with the link can trigger AI calls on your key.** The app has no login. The server limits each IP to 20 requests a minute, which slows abuse but does not stop it. Use a free-tier key (so the worst case is hitting the quota, not a bill), do not use a paid key on a public demo, and consider sharing the link only in your CV or applications.
- **Mock mode as a safe public default:** deploy with no key and the app still works with scripted replies; add the key only when you want a live demo.
- **Delete or rotate the key** if you see unusual usage in AI Studio.
