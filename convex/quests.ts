import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getQuests = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const userId = identity.subject;
    const quests = await ctx.db
      .query("quests")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return quests;
  },
});

export const saveQuest = mutation({
  args: {
    customId: v.string(),
    title: v.string(),
    locationTag: v.string(),
    category: v.string(),
    loreText: v.string(),
    suggestedLevel: v.optional(v.number()),
    status: v.string(),
    isTracked: v.boolean(),
    points: v.number(),
    sortOrder: v.number(),
    subQuests: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        locationTag: v.optional(v.string()),
        objectives: v.array(
          v.object({
            id: v.string(),
            text: v.string(),
            isCompleted: v.boolean(),
            sortOrder: v.number(),
          })
        ),
        isCompleted: v.boolean(),
      })
    ),
    objectives: v.array(
      v.object({
        id: v.string(),
        text: v.string(),
        isCompleted: v.boolean(),
        sortOrder: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const userId = identity.subject;

    const existing = await ctx.db
      .query("quests")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("customId"), args.customId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        title: args.title,
        locationTag: args.locationTag,
        category: args.category,
        loreText: args.loreText,
        suggestedLevel: args.suggestedLevel,
        status: args.status,
        isTracked: args.isTracked,
        points: args.points,
        sortOrder: args.sortOrder,
        subQuests: args.subQuests,
        objectives: args.objectives,
      });
    } else {
      await ctx.db.insert("quests", {
        userId,
        ...args,
      });
    }
  },
});

export const setQuestsBatch = mutation({
  args: {
    quests: v.array(
      v.object({
        customId: v.string(),
        title: v.string(),
        locationTag: v.string(),
        category: v.string(),
        loreText: v.string(),
        suggestedLevel: v.optional(v.number()),
        status: v.string(),
        isTracked: v.boolean(),
        points: v.number(),
        sortOrder: v.number(),
        subQuests: v.array(
          v.object({
            id: v.string(),
            title: v.string(),
            locationTag: v.optional(v.string()),
            objectives: v.array(
              v.object({
                id: v.string(),
                text: v.string(),
                isCompleted: v.boolean(),
                sortOrder: v.number(),
              })
            ),
            isCompleted: v.boolean(),
          })
        ),
        objectives: v.array(
          v.object({
            id: v.string(),
            text: v.string(),
            isCompleted: v.boolean(),
            sortOrder: v.number(),
          })
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const userId = identity.subject;

    for (const q of args.quests) {
      const existing = await ctx.db
        .query("quests")
        .withIndex("by_user", (qQuery) => qQuery.eq("userId", userId))
        .filter((qQuery) => qQuery.eq(qQuery.field("customId"), q.customId))
        .first();

      if (!existing) {
        await ctx.db.insert("quests", { userId, ...q });
      }
    }
  },
});
