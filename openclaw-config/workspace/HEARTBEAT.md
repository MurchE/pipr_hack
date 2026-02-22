# HEARTBEAT.md — Pipr Periodic Tasks

## On Each Heartbeat

### 1. Check-In Scheduling
- Read `sdrs` table from Convex for all active SDRs
- For each SDR: is a check-in call due based on their schedule?
- If yes → load their profile, current schedule block, recent calls, patterns
- Make the call via VAPI with full context injected

### 2. Prospect Research (Daily Morning Batch)
- For each active SDR with a call block starting in the next 2 hours:
  - Pull their target prospect list
  - For prospects without recent intel (>7 days old or never scraped):
    - Send to rtrvr.ai `/agent` endpoint for structured scraping
    - Store results in Convex `prospectIntel` table
  - Budget: max 10 prospects per SDR per day (~$1.20)

### 3. Pattern Analysis (Every 4 Hours)
- For each SDR with 5+ check-ins since last analysis:
  - Pull call log history
  - Run LLM analysis for behavioral patterns:
    - Peak productivity hours
    - Common drift triggers
    - Effective coaching approaches
  - Store/update patterns in Convex `patterns` table

### 4. Escalation Check (End of Day)
- For each SDR with 3+ deviations today:
  - Review pattern history — is this a one-off or recurring?
  - If recurring (3+ high-deviation days in past week): create escalation
  - Severity: warning (3 days) → concern (5 days) → critical (7+ days)

## Check-In Schedule (Default)

| Time | Type | Question |
|------|------|----------|
| 9:00 AM | Morning kickoff | "What's the plan today?" |
| 10:30 AM | Mid-morning | "How's the first block going?" |
| 1:00 PM | Post-lunch | "Back from lunch? What's the afternoon plan?" |
| 3:00 PM | Afternoon push | "Final stretch — where are you on targets?" |
| 4:30 PM | End of day | "How did today go?" |

## Credit Conservation

- Check VAPI balance before calls. If < $1.00: notify operator, skip calls.
- Check rtrvr.ai task count. If > 50 tasks today: skip prospect research.
- If daily outbound limit hit: queue calls for next available window.
