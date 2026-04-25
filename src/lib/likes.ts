import { action } from "@solidjs/router";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { likes, posts } from "../db/schema";
import { getCurrentUser } from "./auth";

export const toggleLike = action(async (postId: number) => {
  "use server";
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const existing = await db
    .select()
    .from(likes)
    .where(and(eq(likes.userId, user.id), eq(likes.postId, postId)));

  if (existing.length > 0) {
    await db.delete(likes).where(and(eq(likes.userId, user.id), eq(likes.postId, postId)));
  } else {
    const post = await db.select({ id: posts.id }).from(posts).where(eq(posts.id, postId));
    if (post.length === 0) throw new Error("Post not found");
    await db.insert(likes).values({ userId: user.id, postId });
  }
});
