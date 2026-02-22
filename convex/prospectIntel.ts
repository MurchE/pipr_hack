import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Store prospect intelligence gathered by rtrvr.ai before coaching calls
export const store = mutation({
  args: {
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
    rtrvrTaskId: v.optional(v.string()),
    usedInCallLog: v.optional(v.id("callLogs")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("prospectIntel", {
      ...args,
    });
  },
});

// Get intel for an SDR's upcoming prospects (used to prep coaching)
export const getForSdr = query({
  args: {
    sdrId: v.id("sdrs"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    return await ctx.db
      .query("prospectIntel")
      .withIndex("by_sdr", (q) => q.eq("sdrId", args.sdrId))
      .order("desc")
      .take(limit);
  },
});

// Get fresh intel for a specific company
export const getForCompany = query({
  args: {
    sdrId: v.id("sdrs"),
    prospectCompany: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("prospectIntel")
      .withIndex("by_sdr_company", (q) =>
        q.eq("sdrId", args.sdrId).eq("prospectCompany", args.prospectCompany)
      )
      .order("desc")
      .first();
  },
});
