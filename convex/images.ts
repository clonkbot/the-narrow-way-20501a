import { action } from "./_generated/server";
import { v } from "convex/values";

// Generate tactical biblical guide pictures using nanobananapro API
export const generateBiblicalImage = action({
  args: {
    prompt: v.string(),
    style: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Construct a reverent, biblical prompt
    const basePrompt = args.prompt;
    const style = args.style || "oil painting, classical religious art, reverent, peaceful";

    try {
      // Using nanobananapro API for image generation
      const response = await fetch("https://api.nanobananapro.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // API key would be configured in environment
        },
        body: JSON.stringify({
          prompt: `${basePrompt}, ${style}, biblical, spiritual, holy`,
          n: 1,
          size: "512x512",
        }),
      });

      if (!response.ok) {
        // Return a placeholder if API is unavailable
        return {
          success: false,
          imageUrl: null,
          error: "Image generation service unavailable",
        };
      }

      const data = await response.json();
      return {
        success: true,
        imageUrl: data.data?.[0]?.url || null,
      };
    } catch (error) {
      return {
        success: false,
        imageUrl: null,
        error: "Failed to generate image",
      };
    }
  },
});
