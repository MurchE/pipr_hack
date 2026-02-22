# REPORTING.md — Manager & Team Analytics

Pipr generates reports for individual SDRs, team leads, and VP Sales.

## SDR Daily Report (Auto-Generated at 5 PM)

Delivered via Slack DM or email:

```
📊 Daily Report — Marcus Rivera (Feb 21, 2026)

Dials: 38 / 50 target (76%)
Emails: 32 / 30 target (107%) ✅
Meetings booked: 1 / 2 target
LinkedIn touches: 22 / 15 target (147%) ✅

Check-ins: 5 | On-track: 3 | Deviations: 2
Voice Energy Score: 44 → 58 → 67 (recovering)
Coach persona today: Sam → Riley → Sam

Deviations:
  10:30 AM — LinkedIn research during call block (mild)
  2:15 PM — Account research during call block (moderate)

Pattern note: This is the 4th day this week with afternoon
research drift. Consider restructuring afternoon blocks to
include dedicated research time.

Top prospect intel used:
  ✅ Bolt Logistics (DHL partnership) — used in 2 PM call
  ⏳ Canopy Financial — briefing delivered, call not yet made
```

## Team Dashboard (Real-Time via Convex)

The Convex `sdrs:dashboard` query powers a real-time team view:

| SDR | Streak | Deviations Today | VES Avg | Pace vs Quota |
|-----|--------|------------------|---------|---------------|
| Sarah Chen | 🔥 6 | 0 | 80 | 112% |
| Marcus Rivera | — | 2 | 56 | 76% |
| Jess Okafor | 2 | 0 | 71 | 94% |
| Kyle Matsuda | 🏖️ PTO | — | — | — |

### Team Aggregates

- **Avg deviation rate:** 1.2 per SDR per day (down from 1.8 last week)
- **Team VES average:** 69 (up from 63 last week — coaching is landing)
- **Meetings booked today:** 3 / 8 target (37% — afternoon block hasn't fired yet)

## Weekly Manager Report (Monday 8 AM)

Delivered to team lead via email:

```
📈 Weekly Report — Enterprise West (Feb 15-21, 2026)

Team performance:
  Dials: 892 / 1,000 target (89%)
  Meetings: 14 / 12 target (117%) ✅
  Pipeline added: $340K (vs $280K last week, +21%)

Coaching impact:
  Total check-ins: 47
  Deviation rate: 28% (down from 34% last week)
  Avg VES: 69 (up from 63)

Individual highlights:
  🌟 Sarah Chen — 12-check-in streak, highest connect rate (11%)
  ⚠️ Marcus Rivera — persistent afternoon drift, recommend
     restructuring his schedule with dedicated research blocks
  🆕 Jess Okafor — Day 2, adapting well, on track

Escalations: 0 new (1 resolved from Tuesday)

Competitive intel (rtrvr.ai):
  - Competitor X posted 6 new SDR jobs (fintech focus)
  - Competitor Y's VP Sales left (LinkedIn update)
```

## ROI Dashboard

For VP Sales / exec stakeholders:

| Metric | Before Pipr | After Pipr (4 weeks) | Delta |
|--------|-------------|---------------------|-------|
| Avg dials/day/SDR | 42 | 54 | +29% |
| Meeting conversion | 6.2% | 8.8% | +42% |
| Time to first call | 47 min after login | 12 min | -74% |
| Deviation rate | (no baseline) | 28% and declining | — |
| SDR ramp time | 6 weeks | 3.5 weeks (projected) | -42% |

## Escalation Notifications

When Pipr creates an escalation (3+ high-deviation days), the team lead gets:

```
🚨 Escalation — Marcus Rivera

Pattern: 5 deviations in a single day (3rd time this week)
All deviations: research/LinkedIn drift during call blocks
Coaching response: Acknowledged but repeated within same day

Recommended action:
  - 1:1 conversation about call anxiety (common pattern)
  - Restructure schedule with research blocks before call blocks
  - Consider pairing with Sarah Chen for joint prospecting sessions

Pipr's coaching alone isn't enough here — this needs human attention.
```

The escalation is logged in Convex with full context so the manager walks in prepared, not cold.
