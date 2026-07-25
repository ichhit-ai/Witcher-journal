import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getBestiary = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const userId = identity.subject;
    return await ctx.db
      .query("bestiary")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const saveBestiaryEntry = mutation({
  args: {
    customId: v.string(),
    name: v.string(),
    category: v.string(),
    subtitle: v.string(),
    weaknesses: v.array(v.string()),
    description: v.string(),
    tactics: v.string(),
    victoriesCount: v.number(),
    iconType: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const userId = identity.subject;

    const existing = await ctx.db
      .query("bestiary")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("customId"), args.customId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("bestiary", { userId, ...args });
    }
  },
});

export const setBestiaryBatch = mutation({
  args: {
    entries: v.array(
      v.object({
        customId: v.string(),
        name: v.string(),
        category: v.string(),
        subtitle: v.string(),
        weaknesses: v.array(v.string()),
        description: v.string(),
        tactics: v.string(),
        victoriesCount: v.number(),
        iconType: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const userId = identity.subject;

    for (const b of args.entries) {
      const existing = await ctx.db
        .query("bestiary")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .filter((q) => q.eq(q.field("customId"), b.customId))
        .first();

      if (!existing) {
        await ctx.db.insert("bestiary", { userId, ...b });
      }
    }
  },
});
