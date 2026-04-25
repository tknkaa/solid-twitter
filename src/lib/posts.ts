import { action, query } from "@solidjs/router";
import { eq, desc } from "drizzle-orm";
import { db } from "~/db";
import { posts, users } from "../db/schema";
import { getCurrentUser } from "./auth";

export const getPosts = query(async () => {
  "use server";
  return await db
    .select({
      id: posts.id,
      content: posts.content,
      createdAt: posts.createdAt,
      userName: users.name,
      userId: posts.userId,
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
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
  await db.delete(posts).where(eq(posts.id, postId));
});
