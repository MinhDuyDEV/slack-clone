import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

import { Id } from "./_generated/dataModel";
import { mutation, QueryCtx } from "./_generated/server";

const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) => {
  return await ctx.db
    .query("members")
    .withIndex("by_user_id_and_workspace_id", (q) =>
      q.eq("userId", userId).eq("workspaceId", workspaceId)
    )
    .unique();
};

export const toggle = mutation({
  args: {
    messageId: v.id("messages"),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");

    const member = await getMember(ctx, message.workspaceId, userId);
    if (!member) throw new Error("Unauthorized");

    const existingMessageReactionFromUser = await ctx.db
      .query("reactions")
      .filter((q) =>
        q.and(
          q.eq(q.field("messageId"), args.messageId),
          q.eq(q.field("memberId"), member._id),
          q.eq(q.field("value"), args.value)
        )
      )
      .first();
    if (existingMessageReactionFromUser) {
      return await ctx.db.delete(existingMessageReactionFromUser._id);
    } else {
      return await ctx.db.insert("reactions", {
        value: args.value,
        messageId: message._id,
        memberId: member._id,
        workspaceId: message.workspaceId,
      });
    }
  },
});
