# Pipr Hackathon — Session Log
**Event:** Return of the Agents (Afore Capital + AI Valley)
**Date:** 2026-02-21
**Location:** San Francisco (Murch in-person) + ClawWin remote build partner
**Submission deadline:** 5:00 PM PST

---

## Timeline

### Pre-event (7:00–9:00 AM)
- ClawWin briefed on hackathon via war room docs (CLAWIN-BRIEFING.md, CONTEXT.md, HACKATHON.md, questionnaire.json)
- Installed Playwright MCP, Context7 MCP, Vercel CLI
- Created squad-channel.md for async agent comms
- Default build plan: Promptrait (12-question AI preference quiz → custom instructions)

### Speeches & sponsor pitches (9:00–11:00 AM)
- Murch at venue, listening to sponsor pitches, relaying intel
- **VAPI** — Voice AI platform. $1,700 track prize. $20 credits. Founder present. Handles turn-taking, interruption, streaming TTS.
- **Convex** — Reactive backend-as-a-service. $500 track prize. Real-time DB + serverless functions.
- **rtrvr.ai** — Web scraping/automation. $0.12/task. Founder Arjin present. Semantic web trees, browser agents.
- **Plivo** — Telephony (calls, SMS). $250+250 credits. Pairs with VAPI for phone-based voice agents.
- **ElevenLabs** — TTS. 3-6mo pro as prize. Natural voice quality.
- **MiniMax** — AI foundation models. $500 x3 prizes.
- **Speechmatics** — Speech recognition/transcription.
- Main prizes: $2,500 / $1,500 / $1,000 + Afore Capital pre-seed consideration ($500K–$2M+)

### Idea exploration (~11:00 AM)
- Generated 5 build options ranging from safe (Promptrait Evolved) to ambitious (ColdCallOS)
- Murch leaning toward Promptrait but open to combining sponsor tools
- Key insight: pitch the platform vision (preference API), not just the quiz

### VPS setup — Pipr instance (~11:15 AM)
- Murch purchased new Hostinger VPS (72.60.226.212) with fresh OpenClaw instance
- OpenClaw container running but WebSocket failing: "control ui requires device identity (use HTTPS or localhost secure context)"
- Root cause: OpenClaw requires HTTPS/WSS or localhost for Control UI — plain HTTP over public IP rejected
- SSH access established via hackathon-specific ed25519 key
- Decision: Install Tailscale for secure access (no HTTPS cert needed, joins existing tailnet)
- Tailscale installed, auth URL generated, awaiting Murch approval
- VPS hostname: `pipr-hackathon`
- Tailscale auth approved, VPS joined tailnet at 100.126.218.95
- Tailscale Serve configured: **https://pipr-hackathon.tail019005.ts.net/** → proxies to localhost:52392 with HTTPS
- OpenClaw Control UI now accessible securely

---

## Team
- **Murch** — Product vision, pitch, taste, judgment
- **Nadia** — Builder/teammate
- **Alexandre** — Builder/teammate
- **Pipr** — OpenClaw instance on Hostinger VPS, primary build orchestrator
- **ClawWin** — Support engineer, VPS setup, session logging
- **ClawLee** — On-call strategy/research via Telegram

## Decisions Made
- Team build (Murch + Nadia + Alexandre + Pipr as orchestrator)
- ClawLee on-call via Telegram for strategy/research
- Public repo: `MurchE/pipr_hack`
- VPS access via Tailscale (not exposed HTTP)

## Open
- Idea not yet locked — Murch gathering final intel from venue
- Tailscale auth pending approval
- Vercel CLI needs `vercel login` (done)
- API keys to be dropped into Pipr once he's online
