import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Log a completed check-in call
export const logCall = mutation({
  args: {
    sdrId: v.id("sdrs"),
    vapiCallId: v.optional(v.string()),
    duration: v.number(),
    type: v.union(
      v.literal("onboarding"),
      v.literal("checkin"),
      v.literal("escalation"),
      v.literal("followup")
    ),
    reportedActivity: v.string(),
    reportedCategory: v.optional(v.string()),
    scheduledActivity: v.optional(v.string()),
    scheduledCategory: v.optional(v.string()),
    deviationDetected: v.boolean(),
    deviationSeverity: v.optional(
      v.union(v.literal("none"), v.literal("mild"), v.literal("moderate"), v.literal("severe"))
    ),
    deviationReason: v.optional(v.string()),
    coachingTone: v.union(
      v.literal("encouraging"),
      v.literal("curious"),
      v.literal("direct"),
      v.literal("firm")
    ),
    coachingMessage: v.optional(v.string()),
    nextAction: v.optional(v.string()),
    callStatus: v.union(
      v.literal("completed"),
      v.literal("no_answer"),
      v.literal("voicemail"),
      v.literal("failed"),
      v.literal("killed")
    ),
    transcript: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("callLogs", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

// Get recent calls for an SDR
export const getForSdr = query({
  args: {
    sdrId: v.id("sdrs"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    return await ctx.db
      .query("callLogs")
      .withIndex("by_sdr_timestamp", (q) => q.eq("sdrId", args.sdrId))
      .order("desc")
      .take(limit);
  },
});

// Get today's calls for an SDR (for deviation count / coaching tone)
export const getTodayForSdr = query({
  args: { sdrId: v.id("sdrs") },
  handler: async (ctx, args) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return await ctx.db
      .query("callLogs")
      .withIndex("by_sdr_timestamp", (q) =>
        q.eq("sdrId", args.sdrId).gte("timestamp", startOfDay.getTime())
      )
      .collect();
  },
});

// Get all calls in a time range (for reporting)
export const getInRange = query({
  args: {
    startTime: v.number(),
    endTime: v.number(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;
    return await ctx.db
      .query("callLogs")
      .withIndex("by_date", (q) =>
        q.gte("timestamp", args.startTime).lte("timestamp", args.endTime)
      )
      .take(limit);
  },
});

// Stats: deviation rate for an SDR
export const deviationRate = query({
  args: { sdrId: v.id("sdrs") },
  handler: async (ctx, args) => {
    const calls = await ctx.db
      .query("callLogs")
      .withIndex("by_sdr", (q) => q.eq("sdrId", args.sdrId))
      .collect();

    const checkIns = calls.filter((c) => c.type === "checkin" && c.callStatus === "completed");
    const deviations = checkIns.filter((c) => c.deviationDetected);

    return {
      totalCheckIns: checkIns.length,
      totalDeviations: deviations.length,
      rate: checkIns.length > 0 ? deviations.length / checkIns.length : 0,
      bySeverity: {
        mild: deviations.filter((c) => c.deviationSeverity === "mild").length,
        moderate: deviations.filter((c) => c.deviationSeverity === "moderate").length,
        severe: deviations.filter((c) => c.deviationSeverity === "severe").length,
      },
    };
  },
});
