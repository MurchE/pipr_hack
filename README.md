# Pipr — SDR Accountability Coach

DEMO: https://id-preview--cff08a73-1357-4973-8fc7-f2410d3b235d.lovable.app/

DEMO VIDEO: https://www.loom.com/embed/7f39b3492ed146f490f5ad787a038463

An AI agent that holds salespeople accountable through scheduled voice check-in calls. Built on [OpenClaw](https://openclaw.ai).

## What Is This?

This repo contains the **configuration files** that transform a stock OpenClaw instance into a specialized SDR (Sales Development Representative) accountability coach. There is no traditional application code here — no Python, no JavaScript, no compiled binary. The configuration IS the product.

This is config-as-code in the same way Terraform defines infrastructure or Kubernetes manifests define deployments. The workspace markdown files define an AI agent's personality, coaching methodology, behavioral rules, tool integrations, and persistent memory. Deploy them onto any OpenClaw instance and you get an SDR accountability coach.

**OpenClaw itself is not included in this repo.** It's an open-source AI agent platform installed separately (via npm or Docker). Think of this repo as the "Terraform configs" — you still need Terraform installed to use them.

---

## What Pipr Actually Does

Pipr is a voice-first AI agent that calls salespeople on the phone throughout their workday to keep them accountable to their own commitments. Here's the full lifecycle:

### Phase 1: Onboarding

When a new SDR is added, Pipr conducts a 5-minute onboarding call. This isn't a form — it's a real voice conversation where Pipr asks:

- "Walk me through your ideal day. What does a productive day look like for you?"
- "What are your daily KPIs? How many dials, emails, meetings?"
- "What's your plan for today — talk me through your time blocks."

Pipr uses its LLM brain (MiniMax M2.1, 200K context) to extract structured data from this conversation: the SDR's intended schedule, their targets, and what "productive" means for them specifically. This gets stored as a profile in the Convex real-time backend.

The key insight: **Pipr holds you accountable to YOUR plan, not some manager's template.** You define what you said you'd do. Pipr just makes sure you do it.

### Phase 2: Scheduled Check-Ins

Throughout the workday, Pipr calls the SDR at regular intervals (default: every 60-90 minutes). These are short calls — 60 to 90 seconds:

- **Morning kickoff (9:00 AM):** "What's the plan today? Walk me through it."
- **Mid-morning (10:30 AM):** "How's the first block going? Where are you on dials?"
- **Post-lunch (1:00 PM):** "Back from lunch? What's the afternoon plan?"
- **Afternoon push (3:00 PM):** "Final stretch. Where are you on today's targets?"
- **End of day (4:30 PM):** "How did today go? What's carrying over to tomorrow?"

The SDR self-reports what they've been doing. Pipr compares this against the committed schedule using LLM reasoning.

### Phase 3: Deviation Coaching

When the SDR's reported activity doesn't match their plan, Pipr coaches the gap — with escalating directness based on how many times it's happened that day:

- **First deviation (curious):** "Hey, I see you shifted from dialing to research. Intentional, or did you get pulled?"
- **Second deviation (direct):** "You were supposed to have 15 dials done by now — you're at 8. Let's prioritize the call list."
- **Third+ deviation (firm):** "This is the third time today you've drifted off-plan. What's really blocking you? Let's figure this out."

Coaching is always behavior-specific, never personal. "You spent 25 minutes on LinkedIn browsing instead of outreach" is coaching. "You're lazy" is never acceptable.

Pipr also celebrates wins: if an SDR is ahead of pace, crushing their targets, booking meetings — Pipr says so. Positive reinforcement is as important as correction.

### Phase 4: Pattern Learning

Over days and weeks, Pipr builds behavioral profiles per SDR:

- Which time blocks are most productive (some SDRs crush it before lunch, others peak in the afternoon)
- Common drift patterns (LinkedIn research rabbit holes, admin task expansion, social media "breaks" that extend)
- What coaching approaches actually change behavior for each individual
- Peak performance conditions and triggers

This memory persists across sessions through the MEMORY.md system and the Convex backend.

### Phase 5: Escalation

When an SDR is persistently off-track and coaching isn't moving the needle, Pipr can flag the pattern to team leads. This is configurable — the thresholds, the notification channel, and the level of detail shared are all set in the config.

### What Pipr Is NOT

- **Not surveillance software.** No screen recording, no browser tab monitoring, no mouse tracking, no keystroke logging. Pipr asks you what you've been doing and coaches the gap.
- **Not a micromanager.** Calls are 60-90 seconds. Pipr respects the SDR's selling time.
- **Not a replacement for human management.** Pipr handles the repetitive accountability layer so managers can focus on strategic coaching, deal reviews, and career development.

---

## Architecture

### The Platform: OpenClaw

[OpenClaw](https://openclaw.ai) is an open-source AI agent platform. It provides:

- An LLM-powered agent runtime with tool use (file system, browser, shell, web search)
- A workspace system (markdown files that define the agent's personality and behavior)
- Multi-channel communication (web chat, WhatsApp, Telegram, Slack, Discord)
- Heartbeat scheduling (periodic check-ins that trigger agent actions)
- Memory persistence (files + SQLite)
- A web-based Control UI for interaction

Pipr's configuration files sit on top of this platform. OpenClaw handles the infrastructure — model routing, tool execution, session management. The workspace files in this repo define _what_ the agent does and _how_ it behaves.

### The Stack

| Layer | Tool | What It Does |
|-------|------|-------------|
| **Agent Runtime** | [OpenClaw](https://openclaw.ai) | Hosts the AI agent, manages sessions, routes tools |
| **Primary LLM** | [MiniMax M2.1](https://minimax.io) | 200K context window. All coaching reasoning, schedule comparison, response generation |
| **Fallback LLM** | [OpenAI GPT-5.2](https://openai.com) | Backup model if MiniMax is unavailable |
| **Voice Calls** | [VAPI](https://vapi.ai) | Outbound/inbound phone calls, turn-taking, streaming TTS |
| **Voice Synthesis** | [ElevenLabs](https://elevenlabs.io) | Natural-sounding voice for coaching calls |
| **Speech Recognition** | [Speechmatics](https://speechmatics.com) | Call transcription and audio analysis |
| **Backend/Persistence** | [Convex](https://convex.dev) | Real-time database for SDR profiles, schedules, call logs |
| **Web Research** | Chromium (headless) | Prospect research, lead intel gathering |

### Config File Breakdown

```
openclaw-config/
├── openclaw.json              # Platform config
│   ├── models.providers       # MiniMax M2.1 as primary, OpenAI as fallback
│   ├── agents.defaults        # Default model routing for all agents
│   ├── channels               # WhatsApp, Telegram, Slack channel configs
│   ├── gateway                # Auth, proxy, Control UI settings
│   └── plugins                # Enabled communication channels
│
├── .env.example               # Required API keys (redacted)
│
├── workspace/                 # The "soul" of the agent
│   ├── IDENTITY.md            # Name, persona, capabilities, limitations
│   ├── SOUL.md                # Coaching philosophy, tone escalation rules,
│   │                          #   voice call protocol, boundaries
│   ├── USER.md                # SDR archetypes, productive vs drift behaviors,
│   │                          #   communication style preferences
│   ├── TOOLS.md               # VAPI call configs, API endpoints, integration
│   │                          #   notes, CRITICAL lessons learned
│   ├── HEARTBEAT.md           # Check-in schedule (5 daily touchpoints),
│   │                          #   tone escalation logic, credit conservation
│   ├── MEMORY.md              # Persistent learnings from coaching sessions
│   ├── AGENTS.md              # Agent behavior framework (session protocol,
│   │                          #   memory management, safety rules)
│   ├── BOOTSTRAP.md           # First-run identity setup ritual
│   └── BOOT.md                # Startup task instructions
│
├── agents/main/agent/
│   └── models.json            # Full MiniMax model catalog (M2.1, M2.5,
│                              #   VL-01 vision, Lightning variants)
│
├── cron/jobs.json             # Scheduled jobs (currently empty — check-ins
│                              #   run via heartbeat instead)
├── devices/                   # Device pairing records (auto-generated)
├── identity/                  # Device crypto identity (auto-generated)
├── canvas/index.html          # Web UI test page
└── logs/                      # Config change audit trail
```

---

## Setup Guide

### Prerequisites

- A server (VPS, cloud instance, or local machine) with Docker or Node.js 20+
- API keys for the integrations you want to use (see `.env.example`)

### Step 1: Install OpenClaw

OpenClaw is installed via npm. On a fresh server:

```bash
# Install Node.js 20+ if needed
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install OpenClaw globally
npm install -g openclaw

# Or run via Docker (Hostinger VPS comes with this pre-configured)
docker run -d --name openclaw \
  -p 52392:52392 \
  -v /data:/data \
  ghcr.io/hostinger/hvps-openclaw:latest
```

### Step 2: Deploy Pipr's Configuration

```bash
# Clone this repo
git clone https://github.com/MurchE/pipr_hack.git
cd pipr_hack

# Copy config files to OpenClaw's data directory
cp -r openclaw-config/* /data/.openclaw/
# (or wherever your OpenClaw instance stores its data)

# Set up your API keys
cp /data/.openclaw/.env.example /data/.openclaw/.env
nano /data/.openclaw/.env  # Fill in your real keys
```

### Step 3: Required API Keys

| Key | Where to Get It | What It's For |
|-----|----------------|---------------|
| `MINIMAX_API_KEY` | [minimax.io](https://minimax.io) | Primary LLM |
| `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com) | Fallback LLM |
| `VAPI_API_KEY` | [vapi.ai](https://vapi.ai) | Voice calls |
| `ELEVENLABS_API_KEY` | [elevenlabs.io](https://elevenlabs.io) | Voice synthesis |
| `SPEECHMATICS_API_KEY` | [speechmatics.com](https://speechmatics.com) | Transcription |

You'll also need to create a VAPI assistant and phone number, then set:
- `VAPI_ASSISTANT_ID` — your VAPI assistant's UUID
- `VAPI_PHONE_NUMBER_ID` — your VAPI phone number's UUID

### Step 4: Access the Agent

If running locally: `http://localhost:52392`

If on a VPS, you'll need HTTPS for the Control UI. Options:
- **Tailscale Funnel** (what we used): `tailscale serve --bg http://localhost:52392` then `tailscale funnel 443 on`
- **Nginx + Let's Encrypt**: Standard reverse proxy with SSL
- **Cloudflare Tunnel**: Zero-config HTTPS

### Step 5: First Conversation

Open the Control UI and start chatting. Pipr will follow the BOOTSTRAP.md ritual to establish identity, then it's ready to start onboarding SDRs and making check-in calls.

---

## VPS Deployment Playbook

This is exactly how we deployed Pipr at the hackathon — a fresh Hostinger VPS to a working SDR coach in under 30 minutes. This playbook works on any Ubuntu/Debian VPS.

### 1. Provision the VPS

Any VPS provider works (Hostinger, DigitalOcean, Hetzner, Linode, etc.). Minimum specs:
- **1 vCPU, 1GB RAM** (sufficient for OpenClaw + headless Chromium)
- **Ubuntu 22.04+** or Debian 12+
- **Public IPv4** (for initial SSH access)

Hostinger's VPS plans come with OpenClaw pre-installed via Docker. If your provider doesn't, see "Manual Install" below.

### 2. SSH In and Verify OpenClaw

```bash
ssh root@YOUR_VPS_IP

# Check if OpenClaw container is running (Hostinger)
docker ps
# You should see: ghcr.io/hostinger/hvps-openclaw:latest

# Check the version
docker exec $(docker ps -q | head -1) openclaw --version

# Find the gateway port
docker exec $(docker ps -q | head -1) openclaw gateway status
# Default: port 52392
```

### 3. Set Up HTTPS Access

OpenClaw's Control UI requires HTTPS (or localhost) for WebSocket connections and device pairing. Three options:

**Option A: Tailscale (Fastest — what we used)**
```bash
# Install Tailscale on the VPS
curl -fsSL https://tailscale.com/install.sh | sh
tailscale up --hostname pipr-hackathon

# Approve the device on your Tailscale admin console
# Then set up HTTPS proxy + public access:
tailscale serve --bg http://localhost:52392
tailscale funnel 443 on

# Your agent is now live at:
# https://pipr-hackathon.YOUR-TAILNET.ts.net/
```

**Option B: Nginx + Let's Encrypt**
```bash
apt install nginx certbot python3-certbot-nginx
# Point a domain at your VPS IP, then:
certbot --nginx -d pipr.yourdomain.com
# Configure nginx to proxy to localhost:52392
```

**Option C: Cloudflare Tunnel**
```bash
# Install cloudflared, create tunnel, route to localhost:52392
# Zero firewall config needed
```

### 4. Deploy Pipr's Config

```bash
# From your local machine:
git clone https://github.com/MurchE/pipr_hack.git
cd pipr_hack

# Copy configs to the VPS
# If Docker (Hostinger):
CONTAINER=$(ssh root@YOUR_VPS_IP "docker ps -q | head -1")
scp -r openclaw-config/* root@YOUR_VPS_IP:/tmp/pipr-config/
ssh root@YOUR_VPS_IP "docker cp /tmp/pipr-config/. $CONTAINER:/data/.openclaw/"

# If bare metal:
scp -r openclaw-config/* root@YOUR_VPS_IP:/data/.openclaw/
```

### 5. Add API Keys

```bash
# SSH into VPS, then into the container
ssh root@YOUR_VPS_IP
docker exec -it $(docker ps -q | head -1) bash

# Create .env from template
cp /data/.openclaw/.env.example /data/.openclaw/.env
nano /data/.openclaw/.env
# Fill in your real API keys
```

### 6. Restart and Verify

```bash
# Restart the gateway to pick up new configs
docker exec $(docker ps -q | head -1) openclaw gateway restart

# Or restart the whole container
docker restart $(docker ps -q | head -1)
```

Open the Control UI URL in your browser. You should see the chat interface. If you get a "device identity" error, the HTTPS proxy isn't working — check step 3.

### 7. Disable Device Auth (Optional, Hackathon Only)

For a hackathon or demo, you may want to skip device pairing:

```bash
docker exec $(docker ps -q | head -1) openclaw config set \
  gateway.controlUi.dangerouslyDisableDeviceAuth true

docker exec $(docker ps -q | head -1) openclaw config set \
  gateway.controlUi.allowInsecureAuth true
```

**Do NOT do this in production.** Device auth exists for a reason.

### Manual Install (Non-Hostinger VPS)

If your VPS doesn't come with OpenClaw pre-installed:

```bash
# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install OpenClaw globally
npm install -g openclaw

# Initialize workspace
openclaw init

# Start the gateway
openclaw gateway start
```

Or use Docker:

```bash
docker run -d --name openclaw \
  -p 52392:52392 \
  -v /data:/data \
  --restart unless-stopped \
  ghcr.io/hostinger/hvps-openclaw:latest
```

### Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| "control ui requires device identity" | No HTTPS | Set up Tailscale/Nginx/Cloudflare (step 3) |
| WebSocket disconnect (1005/1006) | Gateway crashed or proxy misconfigured | Check `docker logs`, restart container |
| "pairing required" on every reload | Device auth not disabled | Run the `config set` commands in step 7 |
| 502 from Tailscale Serve | Wrong proxy protocol | Use `http://localhost:52392` not `https+insecure://` |
| VAPI calls failing | Wrong assistant ID or credit limit hit | Verify `VAPI_ASSISTANT_ID` in `.env`, check VAPI dashboard for credits |

---

## Built At

**Return of the Agents Hackathon** — [Afore Capital](https://afore.vc) + AI Valley
San Francisco, February 21, 2026

## Team

Built by humans + AI agents working together.
