import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Set schedule blocks for an SDR's day (from onboarding or daily planning call)
export const setDaySchedule = mutation({
  args: {
    sdrId: v.id("sdrs"),
    date: v.string(), // "2026-02-21"
    blocks: v.array(
      v.object({
        startTime: v.string(),
        endTime: v.string(),
        activity: v.string(),
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
        dialTarget: v.optional(v.number()),
        notes: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Clear existing blocks for this day
    const existing = await ctx.db
      .query("scheduleBlocks")
      .withIndex("by_sdr_date", (q) => q.eq("sdrId", args.sdrId).eq("date", args.date))
      .collect();

    for (const block of existing) {
      await ctx.db.delete(block._id);
    }

    // Insert new blocks
    for (const block of args.blocks) {
      await ctx.db.insert("scheduleBlocks", {
        sdrId: args.sdrId,
        date: args.date,
        ...block,
      });
    }
  },
});

// Get current schedule block (what should the SDR be doing RIGHT NOW?)
export const getCurrentBlock = query({
  args: { sdrId: v.id("sdrs") },
  handler: async (ctx, args) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const currentTime =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0");

    const blocks = await ctx.db
      .query("scheduleBlocks")
      .withIndex("by_sdr_date", (q) => q.eq("sdrId", args.sdrId).eq("date", today))
      .collect();

    return (
      blocks.find((b) => b.startTime <= currentTime && b.endTime > currentTime) ?? null
    );
  },
});

// Get full day schedule
export const getDaySchedule = query({
  args: {
    sdrId: v.id("sdrs"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("scheduleBlocks")
      .withIndex("by_sdr_date", (q) => q.eq("sdrId", args.sdrId).eq("date", args.date))
      .collect();
  },
});
