import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  quests: defineTable({
    userId: v.string(),
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
  }).index("by_user", ["userId"]),

  bestiary: defineTable({
    userId: v.string(),
    customId: v.string(),
    name: v.string(),
    category: v.string(),
    subtitle: v.string(),
    weaknesses: v.array(v.string()),
    description: v.string(),
    tactics: v.string(),
    victoriesCount: v.number(),
    iconType: v.string(),
  }).index("by_user", ["userId"]),

  glossary: defineTable({
    userId: v.string(),
    customId: v.string(),
    title: v.string(),
    category: v.string(),
    content: v.string(),
    dateCreated: v.string(),
    icon: v.string(),
  }).index("by_user", ["userId"]),

  playerStats: defineTable({
    userId: v.string(),
    totalXp: v.number(),
    inventoryCount: v.number(),
    maxInventory: v.number(),
    crowns: v.number(),
  }).index("by_user", ["userId"]),
});
