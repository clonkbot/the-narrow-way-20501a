import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.category) {
      return await ctx.db
        .query("teachings")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("teachings")
      .withIndex("by_created")
      .order("desc")
      .collect();
  },
});

export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("teachings")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("teachings").first();
    if (existing) return;

    const teachings = [
      {
        title: "Why World Peace Remains Elusive",
        content: "Scripture teaches us that the heart of man is 'deceitful above all things, and desperately wicked' (Jeremiah 17:9). Since the fall of Adam, humanity has been in a state of rebellion against God. This fundamental brokenness means that true, lasting peace cannot be achieved through human effort alone. Wars, conflicts, and strife are symptoms of a deeper spiritual problem that only Christ can remedy.\n\nThe prophet Isaiah spoke of a time when 'nation shall not lift up sword against nation, neither shall they learn war any more' (Isaiah 2:4). But this prophecy points to the Millennial Kingdom when Christ Himself will reign. Until that day, we live in a fallen world where peace remains partial and temporary.",
        scriptureReferences: ["Jeremiah 17:9", "Isaiah 2:4", "Romans 3:23"],
        category: "peace",
        createdAt: Date.now(),
      },
      {
        title: "The Prophecy of the Last Days",
        content: "Jesus warned His disciples of the signs that would precede His return. In Matthew 24, He speaks of wars, famines, earthquakes, and persecution. These are not signs of God's absence, but rather confirmation that His prophetic word is being fulfilled.\n\nThe apostle Paul wrote to Timothy that 'in the last days perilous times shall come' (2 Timothy 3:1). We see this playing out in our world today. Rather than causing us fear, these signs should strengthen our faith and remind us that God's timeline is unfolding exactly as He planned.",
        scriptureReferences: ["Matthew 24:6-8", "2 Timothy 3:1-5", "Luke 21:25-28"],
        category: "prophecy",
        createdAt: Date.now() - 86400000,
      },
      {
        title: "Our Hope in Christ Alone",
        content: "While the world seeks solutions in politics, economics, and human wisdom, believers know that our hope is not in this world's systems. Peter reminds us that we are 'looking for new heavens and a new earth, wherein dwelleth righteousness' (2 Peter 3:13).\n\nThis eternal perspective does not make us passive or uncaring about the world's suffering. Rather, it motivates us to share the Gospel—the only true source of peace and reconciliation. Every soul saved is a step toward the ultimate peace that Christ will bring.",
        scriptureReferences: ["2 Peter 3:13", "Titus 2:13", "Revelation 21:1-4"],
        category: "hope",
        createdAt: Date.now() - 172800000,
      },
      {
        title: "Walking in Truth",
        content: "Jesus declared, 'I am the way, the truth, and the life: no man cometh unto the Father, but by me' (John 14:6). In a world filled with deception and false promises of peace, we cling to the unchanging truth of God's Word.\n\nThe simplicity of our faith—trusting in Christ, living according to Scripture, loving our neighbors—stands in contrast to the complexity of worldly solutions. We need not be swayed by every new philosophy or promise. The truth has already been revealed, and His name is Jesus.",
        scriptureReferences: ["John 14:6", "John 8:32", "Psalm 119:105"],
        category: "truth",
        createdAt: Date.now() - 259200000,
      },
    ];

    for (const t of teachings) {
      await ctx.db.insert("teachings", t);
    }
  },
});
