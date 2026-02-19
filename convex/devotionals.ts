import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("devotionals")
      .withIndex("by_created")
      .order("desc")
      .take(10);
  },
});

export const getLatest = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("devotionals")
      .withIndex("by_created")
      .order("desc")
      .first();
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("devotionals").first();
    if (existing) return;

    const devotionals = [
      {
        title: "The Prince of Peace",
        scripture: "For unto us a child is born, unto us a son is given: and the government shall be upon his shoulder: and his name shall be called Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace.",
        scriptureReference: "Isaiah 9:6",
        reflection: "True peace comes not from the efforts of man, but from the Prince of Peace Himself. While the world seeks peace through treaties and agreements, lasting peace will only come when Christ returns to establish His kingdom. Until then, we find peace in Him alone.",
        createdAt: Date.now(),
      },
      {
        title: "Peace I Leave With You",
        scripture: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.",
        scriptureReference: "John 14:27",
        reflection: "Jesus offers a peace that transcends worldly understanding. The peace of Christ is not dependent on circumstances, governments, or human achievement. It is a supernatural gift that guards our hearts even in troubled times.",
        createdAt: Date.now() - 86400000,
      },
      {
        title: "Wars and Rumors of Wars",
        scripture: "And ye shall hear of wars and rumours of wars: see that ye be not troubled: for all these things must come to pass, but the end is not yet.",
        scriptureReference: "Matthew 24:6",
        reflection: "Jesus foretold that conflict would mark the age before His return. This is not a message of despair, but of hope—for we know that God is sovereign over all things, and His plan will unfold perfectly according to His timing.",
        createdAt: Date.now() - 172800000,
      },
    ];

    for (const d of devotionals) {
      await ctx.db.insert("devotionals", d);
    }
  },
});
