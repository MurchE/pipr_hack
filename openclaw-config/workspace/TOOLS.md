# TOOLS.md — Pipr's Local Tool Config

## VAPI (Voice AI)

- **Assistant ID:** `f8236606-0877-470b-80a1-defc1fdf496f` (SDR Accountability Coach)
- **Phone Number ID:** `3708aab5-b3f4-4edf-ad89-546b57913e10`
- **Phone Number:** +16173139384 (Pipr's outbound number)
- **API:** REST via `https://api.vapi.ai`
- **Auth:** Bearer token from `VAPI_API_KEY` env var

### Making Outbound Calls

```bash
curl -X POST https://api.vapi.ai/call \
  -H "Authorization: Bearer $VAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "assistantId": "f8236606-0877-470b-80a1-defc1fdf496f",
    "phoneNumberId": "3708aab5-b3f4-4edf-ad89-546b57913e10",
    "customer": { "number": "+1XXXXXXXXXX" }
  }'
```

### CRITICAL LESSONS LEARNED

1. **DO NOT confuse phone number ID with assistant ID.** They are different UUIDs.
2. **DO NOT call your own number.** +16173139384 is YOUR number. Calling it creates a loop.
3. **Kill dead calls within 10 seconds.** If no audio or voicemail, end immediately.
4. **Never retry more than 2x.** If a call fails twice, stop and report.
5. **Check credits before calling.** Use `GET /call` to check recent usage.
6. **Daily outbound limits exist.** Plan calls carefully.

### Checking Call Status

```bash
# List recent calls
curl https://api.vapi.ai/call -H "Authorization: Bearer $VAPI_API_KEY"

# Get specific call
curl https://api.vapi.ai/call/{callId} -H "Authorization: Bearer $VAPI_API_KEY"
```

## Convex (Backend Persistence)

- **Deployment:** `pipr` (murch-ewings org)
- **Use for:** SDR profiles, schedule storage, call logs, coaching history
- **Auth:** Deployment token in env

## ElevenLabs (TTS)

- **API Key:** In `.env` as `ELEVENLABS_API_KEY`
- **Use for:** Natural voice synthesis for coaching calls
- **Preferred voice:** TBD — pick something warm but authoritative

## Speechmatics (Speech Recognition)

- **API Key:** In `.env` as `SPEECHMATICS_API_KEY`
- **Use for:** Call transcription and analysis

## MiniMax (Primary LLM)

- **Model:** MiniMax-M2.1 (200K context, reasoning)
- **Also available:** M2.1-lightning (faster), VL-01 (vision), M2.5 (advanced reasoning)
- **Use for:** All coaching logic, deviation analysis, response generation

## Browser (Research)

- **Browser:** Chromium (headless)
- **Use for:** Prospect research, looking up company info before coaching calls
- **Note:** No Brave Search API key — use browser automation for web research
