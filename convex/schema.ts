import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // SDR profiles — created during onboarding call
  sdrs: defineTable({
    name: v.string(),
    phone: v.string(), // E.164 format
    timezone: v.string(), // e.g. "America/New_York"
    role: v.optional(v.string()), // "SDR", "AE", "BDR"
    team: v.optional(v.string()),
    managerId: v.optional(v.id("sdrs")),

    // KPIs extracted from onboarding
    dailyDialTarget: v.optional(v.number()),
    dailyEmailTarget: v.optional(v.number()),
    dailyMeetingTarget: v.optional(v.number()),

    // Coaching state
    deviationsToday: v.number(), // resets daily
    totalCheckIns: v.number(),
    totalDeviations: v.number(),
    currentStreak: v.number(), // consecutive on-track check-ins
    bestStreak: v.number(),

    // Status
    status: v.union(v.literal("active"), v.literal("paused"), v.literal("onboarding")),
    onboardedAt: v.optional(v.number()), // timestamp
    lastCheckInAt: v.optional(v.number()),
  })
    .index("by_phone", ["phone"])
    .index("by_status", ["status"])
    .index("by_team", ["team"]),

  // Daily schedule — time blocks committed during onboarding or daily planning
  scheduleBlocks: defineTable({
    sdrId: v.id("sdrs"),
    date: v.string(), // "2026-02-21"
    startTime: v.string(), // "09:00"
    endTime: v.string(), // "10:30"
    activity: v.string(), // "cold calls", "email sequences", "meeting prep"
    category: v.union(
      v.literal("calls"),
      v.literal("email"),
      v.literal("linkedin"),
      v.literal("meetings"),
      v.literal("research"),
      v.literal("admin"),
      v.literal("break"),
      v.literal("other")
    ),
    dialTarget: v.optional(v.number()), // specific target for this block
    notes: v.optional(v.string()),
  })
    .index("by_sdr_date", ["sdrId", "date"])
    .index("by_date", ["date"]),

  // Call logs — every check-in call Pipr makes
  callLogs: defineTable({
    sdrId: v.id("sdrs"),
    vapiCallId: v.optional(v.string()), // VAPI's call UUID
    timestamp: v.number(),
    duration: v.number(), // seconds
    type: v.union(
      v.literal("onboarding"),
      v.literal("checkin"),
      v.literal("escalation"),
      v.literal("followup")
    ),

    // What the SDR reported
    reportedActivity: v.string(), // free-text from conversation
    reportedCategory: v.optional(v.string()), // classified by LLM

    // What they were supposed to be doing
    scheduledActivity: v.optional(v.string()),
    scheduledCategory: v.optional(v.string()),

    // Deviation analysis
    deviationDetected: v.boolean(),
    deviationSeverity: v.optional(
      v.union(v.literal("none"), v.literal("mild"), v.literal("moderate"), v.literal("severe"))
    ),
    deviationReason: v.optional(v.string()), // LLM-generated explanation

    // Coaching delivered
    coachingTone: v.union(
      v.literal("encouraging"),
      v.literal("curious"),
      v.literal("direct"),
      v.literal("firm")
    ),
    coachingMessage: v.optional(v.string()), // what Pipr said
    nextAction: v.optional(v.string()), // specific action item given

    // Call quality
    callStatus: v.union(
      v.literal("completed"),
      v.literal("no_answer"),
      v.literal("voicemail"),
      v.literal("failed"),
      v.literal("killed") // dead call terminated early
    ),
    transcript: v.optional(v.string()),
  })
    .index("by_sdr", ["sdrId"])
    .index("by_sdr_timestamp", ["sdrId", "timestamp"])
    .index("by_date", ["timestamp"]),

  // Behavioral patterns — aggregated insights per SDR
  patterns: defineTable({
    sdrId: v.id("sdrs"),
    patternType: v.union(
      v.literal("peak_hours"), // when they perform best
      v.literal("drift_trigger"), // what pulls them off-task
      v.literal("coaching_response"), // what coaching style works
      v.literal("quota_trajectory"), // are they trending up or down
      v.literal("custom")
    ),
    description: v.string(), // LLM-generated insight
    confidence: v.number(), // 0-1, how confident the pattern is
    dataPoints: v.number(), // how many check-ins this is based on
    firstObserved: v.number(), // timestamp
    lastConfirmed: v.number(), // timestamp
    active: v.boolean(),
  })
    .index("by_sdr", ["sdrId"])
    .index("by_sdr_type", ["sdrId", "patternType"]),

  // Prospect intelligence — scraped by rtrvr.ai before coaching calls
  prospectIntel: defineTable({
    sdrId: v.id("sdrs"),
    prospectCompany: v.string(),
    prospectUrl: v.string(),
    scrapedAt: v.number(),
    intel: v.object({
      companyName: v.optional(v.string()),
      industry: v.optional(v.string()),
      employeeCount: v.optional(v.number()),
      techStack: v.optional(v.array(v.string())),
      recentNews: v.optional(v.array(v.string())),
      keyPeople: v.optional(
        v.array(
          v.object({
            name: v.string(),
            title: v.string(),
            linkedinUrl: v.optional(v.string()),
          })
        )
      ),
      fundingStage: v.optional(v.string()),
      painPoints: v.optional(v.array(v.string())),
    }),
    rtrvrTaskId: v.optional(v.string()), // rtrvr.ai task reference
    usedInCallLog: v.optional(v.id("callLogs")),
  })
    .index("by_sdr", ["sdrId"])
    .index("by_sdr_company", ["sdrId", "prospectCompany"]),

  // Escalations — flagged to managers
  escalations: defineTable({
    sdrId: v.id("sdrs"),
    triggeredAt: v.number(),
    reason: v.string(),
    severity: v.union(v.literal("warning"), v.literal("concern"), v.literal("critical")),
    deviationCount: v.number(), // how many deviations triggered this
    timeframeDays: v.number(), // over what period
    resolvedAt: v.optional(v.number()),
    resolvedBy: v.optional(v.string()),
    notes: v.optional(v.string()),
  })
    .index("by_sdr", ["sdrId"])
    .index("by_severity", ["severity"]),
});
