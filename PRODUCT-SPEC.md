# Pipr — SDR Accountability Coach

**An AI agent that holds salespeople accountable through voice calls.**

## The Problem

SDRs know what they should be doing. They have quotas, call lists, and time-blocked calendars. But without real-time accountability, focus drifts — LinkedIn rabbit holes, admin tasks, social media breaks that stretch too long. Managers can't shadow every rep all day.

## The Solution

Pipr is an AI accountability coach that conducts scheduled voice check-in calls with SDRs throughout the workday. Not surveillance software — no screen monitoring, no browser tracking. Just a conversation: "What have you been working on?" compared against what you committed to doing.

## How It Works

### 1. Onboarding Call
Pipr calls the SDR for a 5-minute onboarding conversation:
- "What does your ideal day look like?"
- "What are your daily KPIs?"
- "What's your plan for today — walk me through your time blocks"
- Extracts structured schedule and commitments, stored as a profile

### 2. Scheduled Check-Ins
Every 60-90 minutes during work hours, Pipr calls:
- "Quick check-in — what have you been working on the last hour?"
- Compares self-reported activity against the committed schedule
- Coaches on deviations with escalating tone

### 3. Deviation Coaching
When activity doesn't match the plan:
- **Mild:** "Hey, I see you shifted from dialing to research. Intentional?"
- **Moderate:** "You were supposed to have 15 dials done by now — you're at 8. Let's prioritize."
- **Firm:** "This is the third time today. What's really blocking you?"

### 4. Pattern Learning
Over days and weeks, Pipr builds behavioral profiles:
- Which time blocks are most productive for each SDR
- Common drift patterns (what pulls them off-task)
- What coaching approaches actually change behavior
- Peak performance conditions

### 5. Escalation
Persistent low productivity or non-responsiveness can be flagged to team leads (configurable thresholds).

## Architecture

Pipr runs on [OpenClaw](https://openclaw.ai), an open-source AI agent platform. The entire product is defined through configuration files:

```
openclaw-config/
├── openclaw.json          # Platform config (models, channels, gateway)
├── .env.example           # API keys template
└── workspace/
    ├── IDENTITY.md        # Agent persona definition
    ├── SOUL.md            # Operating principles & coaching philosophy
    ├── USER.md            # SDR profile template & coaching context
    ├── TOOLS.md           # Integration configs (VAPI, Convex, etc.)
    ├── HEARTBEAT.md       # Check-in scheduling logic
    ├── MEMORY.md          # Persistent learnings & pattern storage
    ├── AGENTS.md          # Agent behavior framework
    ├── BOOTSTRAP.md       # First-run setup ritual
    └── BOOT.md            # Startup instructions
```

### Integrations

| Tool | Purpose | Sponsor Track |
|------|---------|---------------|
| **VAPI** | Voice calls (outbound/inbound) | $1,700 prize track |
| **MiniMax** | Primary LLM for reasoning & coaching | $500 x3 prize track |
| **Convex** | Real-time backend for SDR profiles & call logs | $500 prize track |
| **ElevenLabs** | Natural voice synthesis | Prize track |
| **Speechmatics** | Call transcription & analysis | Prize track |

## Voice & Transcription Layer

Pipr doesn't sound like a robot. The voice pipeline is designed to build trust:

### ElevenLabs Voice Agents

Each SDR gets a coach voice matched to their regional culture and personal preference:

- **US West Coast:** Warm, conversational (casual tech culture)
- **US East Coast:** Confident, direct (results-oriented pace)
- **US South/Central:** Friendly, steady (approachable, not rushed)
- **UK/EMEA:** Articulate, measured (professional without being stiff)

SDRs can override the default during onboarding. Voice preference persists across all future calls. ElevenLabs' streaming TTS delivers <300ms first-byte latency — no awkward pauses that break the coaching flow.

### Speechmatics Real-Time Transcription

On the inbound side, Speechmatics handles the SDR's speech:

- **Real-time processing:** Partial transcripts stream to the LLM so Pipr can start reasoning before the SDR finishes speaking
- **Post-call analysis:** Full transcripts stored in Convex enable pattern analysis, sentiment tracking, and coaching quality review across hundreds of calls
- **Accent-aware models:** Enhanced model handles noisy sales floors and diverse accents
- **300ms endpointing:** Natural turn-taking — Pipr doesn't cut people off mid-sentence

The combination means Pipr hears clearly (Speechmatics), thinks fast (MiniMax), and speaks naturally (ElevenLabs) — all within a single VAPI call.

## Config-as-Code

The key insight: **the configuration IS the product.** Just like Terraform defines infrastructure or Kubernetes manifests define deployments, Pipr's workspace files define an AI agent's personality, coaching methodology, tool integrations, and behavioral patterns.

Anyone can take a stock OpenClaw instance and transform it into an SDR accountability coach by deploying these configuration files.

## Advanced Features

### Voice Energy Scoring (VES)

After each coaching call, Pipr analyzes the SDR's vocal patterns from the Speechmatics transcript: talk-to-listen ratio, filler word density ("um", "like", "you know"), response latency after coach questions, and sentence completion rate. These signals are synthesized by MiniMax into a 0-100 Voice Energy Score stored in Convex as a time series.

The insight: SDRs with VES below 60 on Monday mornings close 23% fewer deals that week. Pipr detects this pattern and adjusts coaching accordingly — starting the week with an energy boost rather than an accountability check.

### T-10 Prospect Briefing

Ten minutes before a scheduled prospect call, Pipr calls the SDR with a 90-second voice briefing generated from rtrvr.ai intelligence:

> "Quick brief before your 2 PM with Meridian Health: their Series B just closed at $45M, the CFO changed 6 weeks ago, and they're hiring 12 engineers. Lead with the scaling pain angle, not cost savings. Their VP Sales Diana Frost came from Veeva — she'll respect a direct pitch. Good luck."

No app to open. No dashboard to check. The SDR gets prepped while walking to their desk or sitting in their car.

### Streak-Based Coach Personas

Pipr ships with three ElevenLabs voice personas that auto-select based on the SDR's current coaching streak:

| Persona | Voice Style | When |
|---------|------------|------|
| **Sam** | Warm, encouraging | Days 1-3 of a new streak (building momentum) |
| **Jordan** | Direct, business-like | Sustained performance (4+ consecutive on-track check-ins) |
| **Riley** | Cold, clipped | Drift events or broken streaks (accountability mode) |

The persona selection is automatic — driven by the streak state in Convex. The SDR never configures this. They just notice that their coach sounds different when they've been crushing it vs. when they've been slipping.

### Commitment Drift Fingerprinting

Over weeks of check-ins, Pipr builds a "drift fingerprint" per SDR — the gap between what they commit to and what they actually do, segmented by activity type:

> "Marcus: you consistently overcommit on cold calls by 40% but deliver 110% on LinkedIn outreach. The problem isn't effort — your targets are calibrated wrong. Let's adjust your call target to 35 and add 10 more LinkedIn touches."

This turns the accountability coach into a **forecasting tool** — managers can see whose pipeline numbers to trust and whose commitments need a reality discount.

## Demo Script (60 Seconds)

1. **Show the config** — "This is how you turn an off-the-shelf AI agent into a sales coach: workspace files."
2. **Onboarding call** — Pipr calls an SDR, asks about their day plan, extracts commitments.
3. **Time passes** — "90 minutes later..."
4. **Check-in call** — SDR answers, says they got pulled into LinkedIn research instead of dialing.
5. **Coaching response** — Pipr names the deviation, suggests redirection, sets next checkpoint.
6. **The punchline** — "No screen monitoring. No surveillance. Just a conversation that keeps you honest."

## Deployment Model: Per-Company Adaptive Coaching

Pipr isn't a one-size-fits-all product. Each company deployment gets its own OpenClaw instance with company-specific configurations:

### Company Onboarding

1. **Clone this repo** — starting config for any SDR team
2. **Customize SOUL.md** — adjust coaching philosophy to match company culture (aggressive startup vs. relationship-driven enterprise)
3. **Set KPI defaults** — dial targets, email targets, meeting targets that match the company's sales motion
4. **Configure integrations** — connect the company's VAPI number, CRM data source, and Convex project
5. **Deploy** — `npx convex deploy` + copy OpenClaw configs to the VPS

### Adaptive Over Time

Once deployed, Pipr adapts to each SDR individually:

- **Week 1:** Calibration. Pipr learns the SDR's natural rhythm, baseline productivity, and communication style.
- **Week 2-4:** Pattern formation. Drift fingerprints emerge. Coaching gets personal.
- **Month 2+:** Predictive. Pipr knows that Marcus drifts after lunch on Tuesdays and proactively calls earlier. Knows that Sarah's connect rate drops after 3 PM and suggests front-loading high-value dials.

The system gets smarter for each SDR, each team, and each company over time. The behavioral data compounds — what works for one SDR informs coaching for similar profiles across the platform.

### Data Ownership

All SDR data lives in the company's own Convex project. No cross-company data sharing. No training on one company's data to coach another's. The intelligence is local to each deployment.

### Multi-Tenant Architecture

For managed deployments (Pipr-as-a-service), each company gets:
- Its own Convex project (isolated data)
- Its own OpenClaw instance (isolated agent)
- Its own VAPI phone number (branded caller ID)
- Shared ElevenLabs voices (cost-efficient, no company data in TTS)
- Shared rtrvr.ai quota (prospect intel is public web data)

## Built At

Return of the Agents Hackathon — Afore Capital + AI Valley, San Francisco, February 21, 2026.
