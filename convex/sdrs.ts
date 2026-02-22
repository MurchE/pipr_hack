import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new SDR during onboarding
export const create = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    timezone: v.string(),
    role: v.optional(v.string()),
    team: v.optional(v.string()),
    dailyDialTarget: v.optional(v.number()),
    dailyEmailTarget: v.optional(v.number()),
    dailyMeetingTarget: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sdrs", {
      ...args,
      deviationsToday: 0,
      totalCheckIns: 0,
      totalDeviations: 0,
      currentStreak: 0,
      bestStreak: 0,
      status: "onboarding",
      onboardedAt: Date.now(),
    });
  },
});

// Mark onboarding complete
export const activate = mutation({
  args: { sdrId: v.id("sdrs") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sdrId, {
      status: "active",
      onboardedAt: Date.now(),
    });
  },
});

// Get SDR by phone number (for incoming calls / lookups)
export const getByPhone = query({
  args: { phone: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sdrs")
      .withIndex("by_phone", (q) => q.eq("phone", args.phone))
      .first();
  },
});

// Get all active SDRs
export const listActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("sdrs")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
  },
});

// Get a single SDR with their today's schedule
export const getWithSchedule = query({
  args: { sdrId: v.id("sdrs") },
  handler: async (ctx, args) => {
    const sdr = await ctx.db.get(args.sdrId);
    if (!sdr) return null;

    const today = new Date().toISOString().split("T")[0];
    const schedule = await ctx.db
      .query("scheduleBlocks")
      .withIndex("by_sdr_date", (q) => q.eq("sdrId", args.sdrId).eq("date", today))
      .collect();

    return { ...sdr, schedule };
  },
});

// Record a deviation (called after each check-in)
export const recordDeviation = mutation({
  args: { sdrId: v.id("sdrs") },
  handler: async (ctx, args) => {
    const sdr = await ctx.db.get(args.sdrId);
    if (!sdr) throw new Error("SDR not found");

    await ctx.db.patch(args.sdrId, {
      deviationsToday: sdr.deviationsToday + 1,
      totalDeviations: sdr.totalDeviations + 1,
      currentStreak: 0, // streak broken
      lastCheckInAt: Date.now(),
    });
  },
});

// Record an on-track check-in
export const recordOnTrack = mutation({
  args: { sdrId: v.id("sdrs") },
  handler: async (ctx, args) => {
    const sdr = await ctx.db.get(args.sdrId);
    if (!sdr) throw new Error("SDR not found");

    const newStreak = sdr.currentStreak + 1;
    await ctx.db.patch(args.sdrId, {
      totalCheckIns: sdr.totalCheckIns + 1,
      currentStreak: newStreak,
      bestStreak: Math.max(sdr.bestStreak, newStreak),
      lastCheckInAt: Date.now(),
    });
  },
});

// Reset daily deviation count (called by cron at midnight per timezone)
export const resetDailyDeviations = mutation({
  args: { sdrId: v.id("sdrs") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sdrId, { deviationsToday: 0 });
  },
});

// Dashboard: get all SDRs with summary stats
export const dashboard = query({
  args: {},
  handler: async (ctx) => {
    const sdrs = await ctx.db
      .query("sdrs")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    return sdrs.map((sdr) => ({
      id: sdr._id,
      name: sdr.name,
      deviationsToday: sdr.deviationsToday,
      currentStreak: sdr.currentStreak,
      totalCheckIns: sdr.totalCheckIns,
      lastCheckInAt: sdr.lastCheckInAt,
    }));
  },
});
