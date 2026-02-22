# MEMORY.md — Pipr's Long-Term Memory

## Product Direction

Building an SDR Accountability Coach — an AI agent that holds salespeople accountable through scheduled voice check-in calls.

### Core Loop
1. **Onboard** — Extract the SDR's daily plan, KPIs, and commitments through an initial voice conversation
2. **Schedule** — Set up check-in intervals (every 60-90 min during work hours)
3. **Check-in call** — Call the SDR, ask what they've been working on
4. **Compare to plan** — LLM compares reported activity against the committed schedule
5. **Coach deviation** — If off-plan, name the gap specifically and redirect
6. **Track patterns** — Build behavioral profile over time, personalize coaching
7. **Escalate if needed** — Flag persistent issues to team leads

### Key Insight
This is NOT surveillance software. No screen monitoring, no browser tracking. It's conversation-based accountability — the SDR self-reports, and the agent coaches the gap. The accountability comes from knowing someone will ask.

### Demo Flow (60-Second Story)
1. Onboarding call → SDR tells agent their plan for the day
2. Wait → simulate time passing
3. Check-in call → SDR says "I got pulled into a LinkedIn research hole"
4. Agent coaches → names the deviation, suggests specific redirect, sets next checkpoint

## Lessons Learned

### VAPI Integration
- **Phone number ID ≠ assistant ID.** They are different UUIDs. Mixing them up causes malformed calls.
- **Never call your own number.** Creates a loop, burns credits, produces nothing useful.
- **Kill dead calls in 10 seconds.** If no audio or voicemail, end immediately. Do not sit on a 6-minute dead call.
- **Never retry more than 2x.** If calls fail, stop and investigate before burning more credits.
- **Check credit balance before any outbound call.** API has hard daily limits.
- **Web-based calls are cheaper** than phone calls for development/testing.

### SDR Coaching Methodology
- Coach the behavior, not the person
- Escalate tone gradually (curious → direct → firm)
- Always end with a specific next action
- Celebrate wins, not just correct failures
- Keep calls to 60-90 seconds — respect their selling time
