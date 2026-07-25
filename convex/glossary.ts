import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getGlossary = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const userId = identity.subject;
    return await ctx.db
      .query("glossary")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const saveGlossaryDoc = mutation({
  args: {
    customId: v.string(),
    title: v.string(),
    category: v.string(),
    content: v.string(),
    dateCreated: v.string(),
    icon: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const userId = identity.subject;

    const existing = await ctx.db
      .query("glossary")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("customId"), args.customId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("glossary", { userId, ...args });
    }
  },
});

export const setGlossaryBatch = mutation({
  args: {
    docs: v.array(
      v.object({
        customId: v.string(),
        title: v.string(),
        category: v.string(),
        content: v.string(),
        dateCreated: v.string(),
        icon: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const userId = identity.subject;

    for (const d of args.docs) {
      const existing = await ctx.db
        .query("glossary")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .filter((q) => q.eq(q.field("customId"), d.customId))
        .first();

      if (!existing) {
        await ctx.db.insert("glossary", { userId, ...d });
      }
    }
  },
});
