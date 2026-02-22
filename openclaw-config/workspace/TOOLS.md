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

## rtrvr.ai (Prospect Intelligence)

- **API:** `https://api.rtrvr.ai`
- **Auth:** Bearer token from `RTRVR_API_KEY` env var
- **Cost:** ~$0.12 per task
- **Use for:** Pre-call prospect research — scraping company websites, LinkedIn profiles, news, tech stacks before SDR coaching calls

### How It Fits

Before each check-in call, Pipr can research the SDR's target prospects using rtrvr.ai's agent endpoint. This turns coaching from generic ("make more calls") into specific ("your next prospect Meridian Health just raised a Series C — lead with their scaling pain points").

### Prospect Research Flow

1. SDR shares their call list (or Pipr reads it from CRM/schedule)
2. Pipr sends each prospect URL to rtrvr.ai's `/agent` endpoint
3. rtrvr.ai scrapes the company website, extracts structured intel
4. Intel stored in Convex `prospectIntel` table
5. During check-in call, Pipr references the intel: "Before you dial Bolt Logistics, note they just partnered with DHL and are hiring 40 engineers — that's a growth signal."

### API Usage

```bash
# Research a prospect company
curl -X POST https://api.rtrvr.ai/agent \
  -H "Authorization: Bearer $RTRVR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Extract company name, industry, employee count, tech stack, recent news, key decision makers, funding stage, and likely pain points",
    "urls": ["https://targetcompany.com"],
    "output_schema": {
      "type": "object",
      "properties": {
        "companyName": {"type": "string"},
        "industry": {"type": "string"},
        "employeeCount": {"type": "number"},
        "techStack": {"type": "array", "items": {"type": "string"}},
        "recentNews": {"type": "array", "items": {"type": "string"}},
        "keyPeople": {"type": "array", "items": {
          "type": "object",
          "properties": {
            "name": {"type": "string"},
            "title": {"type": "string"}
          }
        }},
        "fundingStage": {"type": "string"},
        "painPoints": {"type": "array", "items": {"type": "string"}}
      }
    },
    "response": {"verbosity": "final"}
  }'
```

### When to Scrape

- **Daily morning batch:** Before the SDR's first call block, scrape their top 5-10 target accounts
- **On-demand:** If an SDR mentions a new prospect during a check-in, scrape it immediately
- **Refresh:** Re-scrape accounts older than 7 days for fresh intel

### Cost Control

- Budget ~$1.20/day per SDR (10 prospects × $0.12)
- Cache results in Convex — don't re-scrape the same company within 7 days
- Prioritize high-value prospects (larger deals, upcoming meetings)

## Convex (Backend Persistence)

- **Deployment:** `pipr` (murch-ewings org)
- **Use for:** SDR profiles, schedule storage, call logs, coaching history, prospect intel
- **Auth:** Deployment token in env
- **Tables:** `sdrs`, `scheduleBlocks`, `callLogs`, `patterns`, `escalations`, `prospectIntel`

## ElevenLabs (Voice Agents)

- **API Key:** In `.env` as `ELEVENLABS_API_KEY`
- **Integrated via:** VAPI voice pipeline (ElevenLabs is the TTS backend for outbound calls)
- **Use for:** Natural, human-sounding coaching voice on all SDR calls

### Voice Selection Logic

Pipr uses ElevenLabs voice agents mapped to SDR preferences and regional context. The voice isn't random — it's selected to maximize trust and rapport:

| SDR Region | Default Voice | Rationale |
|-----------|---------------|-----------|
| US West Coast | `Rachel` (warm, conversational) | Casual tech culture, avoid corporate tone |
| US East Coast | `Adam` (confident, direct) | Matches faster-paced, results-oriented culture |
| US South/Central | `Sarah` (friendly, steady) | Approachable, not rushed |
| UK/EMEA | `Charlie` (articulate, measured) | Professional without being stiff |
| APAC | `Bella` (clear, neutral accent) | High intelligibility across accents |

SDRs can override the default voice during onboarding ("I want my coach to sound like X"). Voice preference is stored in the SDR profile and passed to VAPI's `voice` config on each outbound call.

### Why This Matters

Voice coaching lives or dies on trust. A robotic or jarring voice breaks the illusion of a real coach. ElevenLabs' low-latency streaming TTS (<300ms first-byte) keeps conversations feeling natural — no awkward pauses that remind you you're talking to a machine.

The voice agent configuration is passed through VAPI's assistant config:
```json
{
  "voice": {
    "provider": "11labs",
    "voiceId": "rachel",
    "stability": 0.6,
    "similarityBoost": 0.8
  }
}
```

## Speechmatics (Real-Time Transcription & Analysis)

- **API Key:** In `.env` as `SPEECHMATICS_API_KEY`
- **Integrated via:** VAPI voice pipeline (Speechmatics handles STT on the inbound audio stream)
- **Use for:** Real-time call transcription, post-call analysis, coaching quality scoring

### How It Works in the Pipeline

1. **During the call:** Speechmatics processes the SDR's speech in real-time via VAPI's transcription layer. This is how Pipr "hears" what the SDR is saying — the audio stream is transcribed and fed to the LLM for deviation analysis.

2. **Post-call transcript:** After each check-in, the full transcript is stored in the Convex `callLogs` table. This enables:
   - Pattern analysis across calls (LLM reads transcripts to identify drift triggers)
   - Coaching quality review (did Pipr's coaching actually land?)
   - SDR sentiment tracking (tone, energy, defensiveness over time)

3. **Language detection:** Speechmatics auto-detects the SDR's primary language, enabling multilingual coaching for international sales teams. Supports 50+ languages with accent-aware models.

### Transcription Config

Speechmatics is configured through VAPI's transcription settings:
```json
{
  "transcriber": {
    "provider": "speechmatics",
    "language": "en",
    "model": "enhanced",
    "enablePartials": true,
    "endpointing": 300
  }
}
```

- `enablePartials`: Stream partial transcripts so Pipr can start processing before the SDR finishes speaking
- `endpointing: 300`: 300ms silence detection for natural turn-taking (not cutting people off)
- `model: enhanced`: Higher accuracy model for noisy environments (SDRs on sales floors)

## MiniMax (Primary LLM)

- **Model:** MiniMax-M2.1 (200K context, reasoning)
- **Also available:** M2.1-lightning (faster), VL-01 (vision), M2.5 (advanced reasoning)
- **Use for:** All coaching logic, deviation analysis, response generation

## Browser (Research)

- **Browser:** Chromium (headless)
- **Use for:** Prospect research, looking up company info before coaching calls
- **Note:** No Brave Search API key — use browser automation for web research
