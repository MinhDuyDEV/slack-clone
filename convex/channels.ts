import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const member = await ctx.db
      .query("members")
      .withIndex("by_user_id_and_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.workspaceId)
      )
      .unique();
    if (!member || member.role !== "admin") throw new Error("Unauthorized");

    // test-create---channel => test-create-channel
    const parsedName = args.name
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    return await ctx.db.insert("channels", {
      workspaceId: args.workspaceId,
      name: parsedName,
    });
  },
});

export const get = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const member = await ctx.db
      .query("members")
      .withIndex("by_user_id_and_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.workspaceId)
      )
      .unique();
    if (!member) return [];

    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();

    return channels;
  },
});
