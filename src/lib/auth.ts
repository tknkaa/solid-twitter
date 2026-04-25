import { action, query, redirect } from "@solidjs/router";
import { useSession } from "@solidjs/start/http";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

type SessionData = {
	userId?: number;
};

async function getSession() {
	"use server";
	return await useSession<SessionData>({
		password: "abcdefghijklmnopqrstuvwxyz123456",
		name: "auth",
	});
}

export const getCurrentUser = query(async () => {
	"use server";
	const session = await getSession();
	const userId = session?.data.userId;
	if (!userId) return null;
	const result = await db.select().from(users).where(eq(users.id, userId));
	return result[0] ?? null;
}, "currentUser");

export const login = action(async (userId: number) => {
	"use server";
	const session = await getSession();
	await session?.update({ userId });
	throw redirect("/");
});

export const logout = action(async () => {
	"use server";
	const session = await getSession();
	await session?.clear();
	throw redirect("/login");
});
