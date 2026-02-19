import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Daily devotionals and teachings
  devotionals: defineTable({
    title: v.string(),
    scripture: v.string(),
    scriptureReference: v.string(),
    reflection: v.string(),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_created", ["createdAt"]),

  // Teachings on world peace from Biblical perspective
  teachings: defineTable({
    title: v.string(),
    content: v.string(),
    scriptureReferences: v.array(v.string()),
    category: v.string(), // "peace", "prophecy", "hope", "truth"
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_category", ["category"]).index("by_created", ["createdAt"]),

  // User prayer requests
  prayerRequests: defineTable({
    userId: v.id("users"),
    request: v.string(),
    isAnonymous: v.boolean(),
    prayerCount: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]).index("by_created", ["createdAt"]),

  // Track who prayed for what
  prayers: defineTable({
    userId: v.id("users"),
    prayerRequestId: v.id("prayerRequests"),
    createdAt: v.number(),
  }).index("by_user", ["userId"]).index("by_request", ["prayerRequestId"]),

  // User saved scriptures
  savedScriptures: defineTable({
    userId: v.id("users"),
    scripture: v.string(),
    reference: v.string(),
    note: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
