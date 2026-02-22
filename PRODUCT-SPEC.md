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

## Config-as-Code

The key insight: **the configuration IS the product.** Just like Terraform defines infrastructure or Kubernetes manifests define deployments, Pipr's workspace files define an AI agent's personality, coaching methodology, tool integrations, and behavioral patterns.

Anyone can take a stock OpenClaw instance and transform it into an SDR accountability coach by deploying these configuration files.

## Demo Script (60 Seconds)

1. **Show the config** — "This is how you turn an off-the-shelf AI agent into a sales coach: workspace files."
2. **Onboarding call** — Pipr calls an SDR, asks about their day plan, extracts commitments.
3. **Time passes** — "90 minutes later..."
4. **Check-in call** — SDR answers, says they got pulled into LinkedIn research instead of dialing.
5. **Coaching response** — Pipr names the deviation, suggests redirection, sets next checkpoint.
6. **The punchline** — "No screen monitoring. No surveillance. Just a conversation that keeps you honest."

## Built At

Return of the Agents Hackathon — Afore Capital + AI Valley, San Francisco, February 21, 2026.
