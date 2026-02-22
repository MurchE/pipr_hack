# COPILOT-MODE.md — Real-Time Call Co-Pilot

When an SDR is on an active prospect call, Pipr shifts from accountability coach to **live co-pilot** — listening to the dialogue and feeding the SDR real-time intelligence.

## How It Works

1. **SDR starts a prospect call** (via VAPI or their existing dialer)
2. **Speechmatics transcribes both sides** in real-time with speaker diarization
3. **MiniMax analyzes the conversation** turn-by-turn against:
   - The prospect's company intel (from rtrvr.ai / Convex `prospectIntel`)
   - The SDR's battle cards and objection handling playbook
   - Historical win patterns from similar prospect profiles
4. **Pipr surfaces suggestions** via silent text overlay or whispered audio:
   - Objection handlers when pricing pushback detected
   - Talking points when prospect mentions a pain point that matches intel
   - Competitor displacement angles when a competitor name is mentioned
   - "Ask this now" prompts when the conversation stalls

## Trigger Detection

Speechmatics transcript is analyzed for trigger phrases:

| Trigger | Action |
|---------|--------|
| "too expensive" / "budget" / "pricing" | Surface pricing objection handler |
| "we're using [competitor]" | Surface competitive displacement card |
| "not a priority right now" | Surface urgency creation framework |
| "I need to talk to my [boss/team]" | Surface multi-stakeholder navigation |
| "tell me more about..." | Surface relevant case study / proof point |
| [5+ seconds of silence] | Suggest a discovery question to restart momentum |

## Delivery Channels

- **Slack DM:** Real-time text suggestions pushed to SDR's Slack (lowest latency)
- **Whisper mode:** ElevenLabs TTS whispers the suggestion into the SDR's earpiece (VAPI supports audio injection)
- **Screen overlay:** If using the web app, suggestions appear as a floating card

## Post-Call Debrief

After the call ends, Pipr generates a 60-second debrief:

1. **Call score** (0-100) based on: discovery depth, objection handling, next-step commitment
2. **Key moments** — timestamped highlights where the SDR nailed it or missed an opportunity
3. **Coaching note** — one specific thing to do differently next time
4. **Follow-up draft** — auto-generated follow-up email based on what was discussed

Debrief is stored in Convex and delivered via the SDR's preferred channel.

## Battle Cards

Battle cards are stored in the Convex `battleCards` table and loaded before each prospect call:

```json
{
  "trigger": "pricing objection",
  "response": "I hear you on budget. Most of our customers felt the same way initially. What they found is that [product] paid for itself in [X] months because [specific ROI metric]. Would it help if I shared a case study from a company in your space?",
  "effectiveness": 0.72,
  "lastUpdated": "2026-02-20"
}
```

Cards are ranked by effectiveness score — derived from post-call outcome data. Cards that lead to booked meetings get promoted; cards that lead to call endings get demoted.
