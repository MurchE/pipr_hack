import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create an escalation when coaching isn't working
export const create = mutation({
  args: {
    sdrId: v.id("sdrs"),
    reason: v.string(),
    severity: v.union(v.literal("warning"), v.literal("concern"), v.literal("critical")),
    deviationCount: v.number(),
    timeframeDays: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("escalations", {
      ...args,
      triggeredAt: Date.now(),
    });
  },
});

// Get open escalations (for manager dashboard)
export const getOpen = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("escalations")
      .filter((q) => q.eq(q.field("resolvedAt"), undefined))
      .collect();
  },
});

// Resolve an escalation
export const resolve = mutation({
  args: {
    escalationId: v.id("escalations"),
    resolvedBy: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.escalationId, {
      resolvedAt: Date.now(),
      resolvedBy: args.resolvedBy,
      notes: args.notes,
    });
  },
});
