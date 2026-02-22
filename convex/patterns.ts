import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Record a behavioral pattern discovered by the LLM
export const record = mutation({
  args: {
    sdrId: v.id("sdrs"),
    patternType: v.union(
      v.literal("peak_hours"),
      v.literal("drift_trigger"),
      v.literal("coaching_response"),
      v.literal("quota_trajectory"),
      v.literal("custom")
    ),
    description: v.string(),
    confidence: v.number(),
    dataPoints: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if this pattern type already exists for this SDR
    const existing = await ctx.db
      .query("patterns")
      .withIndex("by_sdr_type", (q) =>
        q.eq("sdrId", args.sdrId).eq("patternType", args.patternType)
      )
      .first();

    if (existing) {
      // Update existing pattern with new data
      await ctx.db.patch(existing._id, {
        description: args.description,
        confidence: args.confidence,
        dataPoints: args.dataPoints,
        lastConfirmed: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("patterns", {
      ...args,
      firstObserved: Date.now(),
      lastConfirmed: Date.now(),
      active: true,
    });
  },
});

// Get all active patterns for an SDR (used before check-in calls to personalize coaching)
export const getForSdr = query({
  args: { sdrId: v.id("sdrs") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("patterns")
      .withIndex("by_sdr", (q) => q.eq("sdrId", args.sdrId))
      .filter((q) => q.eq(q.field("active"), true))
      .collect();
  },
});
