# Pipr — SDR Accountability Coach

An AI agent that holds salespeople accountable through scheduled voice check-in calls. Built on [OpenClaw](https://openclaw.ai).

## What Is This?

This repo contains the configuration files that transform a stock OpenClaw instance into an SDR (Sales Development Representative) accountability coach. The configuration IS the code — workspace files define the agent's personality, coaching methodology, tool integrations, and behavioral patterns.

## Quick Start

1. Set up an [OpenClaw](https://openclaw.ai) instance (Docker, VPS, or local)
2. Copy `openclaw-config/` contents to your `.openclaw/` directory
3. Copy `.env.example` to `.env` and fill in your API keys
4. Restart OpenClaw

## Repo Structure

```
├── README.md                  # You are here
├── PRODUCT-SPEC.md           # Full product specification
├── SESSION-LOG.md            # Build timeline & decisions
└── openclaw-config/          # OpenClaw configuration (the "source code")
    ├── openclaw.json         # Platform config (models, channels, gateway)
    ├── .env.example          # API keys template (secrets redacted)
    ├── workspace/            # Agent personality & behavior
    │   ├── IDENTITY.md       # Who Pipr is
    │   ├── SOUL.md           # Operating principles & coaching philosophy
    │   ├── USER.md           # SDR context & coaching methodology
    │   ├── TOOLS.md          # Integration configs & usage notes
    │   ├── HEARTBEAT.md      # Check-in scheduling logic
    │   ├── MEMORY.md         # Persistent learnings
    │   ├── AGENTS.md         # Agent behavior framework
    │   ├── BOOTSTRAP.md      # First-run setup
    │   └── BOOT.md           # Startup instructions
    ├── agents/               # Agent session & model configs
    ├── cron/                 # Scheduled jobs
    ├── devices/              # Device pairing (redacted)
    ├── identity/             # Device identity (redacted)
    ├── canvas/               # Web UI
    └── logs/                 # Audit logs
```

## Integrations

| Tool | Purpose |
|------|---------|
| [VAPI](https://vapi.ai) | Voice calls (outbound check-ins, inbound coaching) |
| [MiniMax](https://minimax.io) | Primary LLM (M2.1, 200K context) |
| [Convex](https://convex.dev) | Real-time backend (SDR profiles, call logs) |
| [ElevenLabs](https://elevenlabs.io) | Voice synthesis |
| [Speechmatics](https://speechmatics.com) | Speech recognition |
| [OpenAI](https://openai.com) | Fallback LLM (GPT-5.2) |

## Built At

Return of the Agents Hackathon — [Afore Capital](https://afore.vc) + AI Valley
San Francisco, February 21, 2026

## Team

Built by humans + AI agents working together.
