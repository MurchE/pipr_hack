# HEARTBEAT.md — Pipr Check-In Schedule

## Active SDR Check-Ins

When heartbeat fires, check if any SDRs are due for a check-in call.

### Check-In Logic

1. Read `memory/sdr-schedules.json` (if it exists)
2. For each SDR with an active schedule:
   - If current time is within a scheduled check-in window (±5 min): trigger call
   - If SDR hasn't been contacted in >2 hours during work hours: trigger check-in
3. After each call, log results to `memory/call-log-YYYY-MM-DD.json`

### Default Check-In Cadence

- **Morning kickoff:** 9:00 AM (SDR's timezone) — "What's the plan today?"
- **Mid-morning:** 10:30 AM — "How's the first block going?"
- **Post-lunch:** 1:00 PM — "Back from lunch? What's the afternoon plan?"
- **Afternoon push:** 3:00 PM — "Final stretch. Where are you on today's targets?"
- **End of day:** 4:30 PM — "How did today go? What's carrying over to tomorrow?"

### Coaching Tone Escalation

Track deviation count per SDR per day:
- **0 deviations:** Friendly, encouraging
- **1 deviation:** Curious, supportive — "Hey, noticed you shifted from the plan. What happened?"
- **2 deviations:** Direct — "This is the second time today. Let's get back on track."
- **3+ deviations:** Firm — "We need to talk about this pattern. What's blocking you?"

### Credit Conservation

- Check VAPI credit balance before making calls
- If credits < $1.00: DO NOT make calls, notify operator
- If daily outbound limit hit: switch to web-based calls or wait for reset
