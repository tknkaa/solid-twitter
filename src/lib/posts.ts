import { action, query } from "@solidjs/router";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "~/db";
import { likes, posts, users } from "../db/schema";
import { getCurrentUser } from "./auth";

export const getPosts = query(async () => {
  "use server";
  const currentUser = await getCurrentUser();
  const currentUserId = currentUser?.id ?? -1;

  return await db
    .select({
      id: posts.id,
      content: posts.content,
      createdAt: posts.createdAt,
      userName: users.name,
      userId: posts.userId,
      likedByMe: sql<number>`case when ${likes.id} is not null then 1 else 0 end`,
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .leftJoin(likes, and(eq(likes.postId, posts.id), eq(likes.userId, currentUserId)))
    .orderBy(desc(posts.createdAt));
}, "posts");

export const createPost = action(async (content: string) => {
  "use server";
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  await db.insert(posts).values({ userId: user.id, content });
});

export const deletePost = action(async (postId: number) => {
  "use server";
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  await db.delete(likes).where(eq(likes.postId, postId));
  await db.delete(posts).where(and(eq(posts.id, postId), eq(posts.userId, user.id)));
});
