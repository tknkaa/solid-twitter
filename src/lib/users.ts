import { action, query } from "@solidjs/router";
import { db } from "../db";
import { users } from "../db/schema";

export const getUsers = query(async () => {
  "use server";
  return await db.select().from(users);
}, "users");

export const createUser = action(async (name: string) => {
  "use server";
  await db.insert(users).values({ name });
});
