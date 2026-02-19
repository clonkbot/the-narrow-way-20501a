import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const requests = await ctx.db
      .query("prayerRequests")
      .withIndex("by_created")
      .order("desc")
      .take(50);

    // Get user info for non-anonymous requests
    const enrichedRequests = await Promise.all(
      requests.map(async (request) => {
        if (request.isAnonymous) {
          return { ...request, userName: "A Brother or Sister in Christ" };
        }
        const user = await ctx.db.get(request.userId);
        return {
          ...request,
          userName: user?.email?.split("@")[0] || "A Believer"
        };
      })
    );

    return enrichedRequests;
  },
});

export const myRequests = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("prayerRequests")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    request: v.string(),
    isAnonymous: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("prayerRequests", {
      userId,
      request: args.request,
      isAnonymous: args.isAnonymous,
      prayerCount: 0,
      createdAt: Date.now(),
    });
  },
});

export const pray = mutation({
  args: { prayerRequestId: v.id("prayerRequests") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if already prayed
    const existingPrayer = await ctx.db
      .query("prayers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("prayerRequestId"), args.prayerRequestId))
      .first();

    if (existingPrayer) return;

    // Record the prayer
    await ctx.db.insert("prayers", {
      userId,
      prayerRequestId: args.prayerRequestId,
      createdAt: Date.now(),
    });

    // Increment prayer count
    const request = await ctx.db.get(args.prayerRequestId);
    if (request) {
      await ctx.db.patch(args.prayerRequestId, {
        prayerCount: request.prayerCount + 1,
      });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("prayerRequests") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const request = await ctx.db.get(args.id);
    if (!request || request.userId !== userId) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);
  },
});
