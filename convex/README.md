# Convex Backend — Pipr Data Layer

This directory contains the Convex schema and server functions that power Pipr's persistent data layer.

## Tables

| Table | Purpose |
|-------|---------|
| `sdrs` | SDR profiles — name, phone, KPIs, coaching state, streaks |
| `scheduleBlocks` | Daily time blocks — what each SDR committed to doing |
| `callLogs` | Every check-in call — reported activity, deviation analysis, coaching delivered |
| `patterns` | Behavioral insights — LLM-discovered patterns per SDR over time |
| `escalations` | Manager flags — when coaching alone isn't enough |

## Data Flow

```
Onboarding Call
  → sdrs.create() + schedules.setDaySchedule()

Check-In Call
  → schedules.getCurrentBlock()     // what should they be doing?
  → patterns.getForSdr()            // any known patterns to reference?
  → [VAPI call happens, LLM compares reported vs scheduled]
  → callLogs.logCall()              // record everything
  → sdrs.recordDeviation() or sdrs.recordOnTrack()

Pattern Analysis (periodic)
  → callLogs.getForSdr()            // pull history
  → [LLM analyzes for patterns]
  → patterns.record()               // store insight

Escalation (when coaching fails)
  → escalations.create()            // flag to manager
```

## Deploy

```bash
# Install Convex CLI
npm install -g convex

# Deploy to your project
npx convex deploy --cmd 'echo deployed'

# Or push to preview
npx convex dev
```

Requires `CONVEX_DEPLOY_KEY` environment variable set to your project's deploy key.
