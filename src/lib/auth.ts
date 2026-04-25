import { action, query, redirect } from "@solidjs/router";
import { getCookie, setCookie, deleteCookie } from "vinxi/http";
import { eq } from "drizzle-orm";
import { db } from "../db"
import { users } from "../db/schema";

export const getCurrentUser = query(async () => {
  "use server";
  const userId = getCookie("userId");
  if (!userId) return null;
  const result = await db.select().from(users).where(eq(users.id, Number(userId)));
  return result[0] ?? null;
}, "currentUser");

export const login = action(async (userId: number) => {
  "use server";
  setCookie("userId", String(userId));
  throw redirect("/");
});

export const logout = action(async () => {
  "use server";
  deleteCookie("userId");
  throw redirect("/login");
});
