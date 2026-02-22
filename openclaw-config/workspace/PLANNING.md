# PLANNING.md — SDR Task Planning & Daily Prep

Pipr doesn't just react to what SDRs are doing — it proactively plans what they should be doing.

## Daily Planning Call (Morning Kickoff)

At 8:45 AM (SDR's timezone), Pipr calls for a 3-minute planning session:

1. **Yesterday's recap:** "You hit 52 of 60 dials, booked 2 meetings, and had one deviation after lunch. Solid day."
2. **Today's auto-generated schedule:** Based on yesterday's performance + pattern data:
   - If yesterday's call block was strong → keep the same structure
   - If email underperformed → swap email to a better time slot
   - If a deviation happened → schedule that activity for a shorter, more focused block
3. **Prospect prep:** "You've got 3 high-priority prospects today. I scraped their sites overnight — Meridian Health raised their Series C, Bolt is hiring aggressively, and Canopy just got SOC 2. I'll brief you 10 minutes before each call."
4. **SDR confirms or adjusts:** "Does this schedule work, or do you want to change anything?"

The confirmed schedule gets written to Convex `scheduleBlocks` and drives all check-ins for the day.

## Adaptive Scheduling

Pipr uses behavioral patterns to optimize each SDR's schedule over time:

### Time Slot Optimization

```
Week 1: SDR commits to calls 9-11 AM, emails 11-12 PM
Week 2: Data shows connect rate is 6% at 9 AM but 14% at 10 AM
Week 3: Pipr suggests shifting calls to 10-12 PM and emails to 9-10 AM
Week 4: New schedule consistently outperforms old one
```

### Activity Rebalancing

```
SDR consistently overcommits on cold calls (commits 60, delivers 42)
but overdelivers on LinkedIn (commits 10, delivers 18)

Pipr: "Your call target has been optimistic. Let's set it at 45 and
add 8 more LinkedIn touches. Same total effort, more honest targets."
```

### Fatigue Detection

When VES (Voice Energy Score) drops below 50 for two consecutive check-ins:

> "Your energy's dipping. Let's switch the next block from calls to something lower-intensity — maybe email or prospect research. Protect your best hours for dialing."

## Task Queue

Beyond time blocks, Pipr maintains a task queue per SDR:

| Priority | Task | Source | Due |
|----------|------|--------|-----|
| P0 | Follow up with Diana Frost (Meridian) — she asked for pricing | Post-call debrief | Today 2 PM |
| P1 | Send 3 personalized LinkedIn connections | Daily plan | Today 4 PM |
| P1 | Update CRM notes for yesterday's calls | Carry-over from yesterday | Today 5 PM |
| P2 | Research 5 new accounts for tomorrow | Standing daily task | Today 5:30 PM |

Tasks are surfaced during check-in calls when relevant: "Before you start dialing — did you send that pricing follow-up to Diana? That's your highest-value action right now."

## Weekly Planning (Monday Morning)

A longer 5-minute Monday call covers:

1. **Last week's performance:** Total dials, meetings booked, deviation rate, streak data
2. **Pattern insights:** "You booked 3 of your 4 meetings before noon. Your afternoons are for pipeline building, not closing."
3. **This week's targets:** Adjusted based on trend and quota trajectory
4. **Competitive intel:** "rtrvr.ai picked up that [competitor] posted 6 new SDR jobs last week. They're going hard on fintech — you might see more competition in those accounts."
