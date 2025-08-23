import { users } from "../../database/schema";
import { db } from "../../database/drizzle";
import { eq } from "drizzle-orm";
import { createClerkClient } from "@clerk/backend";
import { redirect } from "react-router";

export const getExistingUser = async (id: string) => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.accountId, id))
      .limit(1);

    return user.pop();
  } catch (error) {
    console.error("Error fetching user: ", error);
    return null;
  }
};

export const storeUserData = async (id: string) => {
  try {
    const clerk = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    const user = await clerk.users.getUser(id);

    const createdUser = await db
      .insert(users)
      .values({
        accountId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        name: user.fullName as string,
        imageUrl: user.imageUrl,
        joinedAt: new Date().toISOString(),
      })
      .returning();

    if (!createdUser) return redirect("/sign-in");
  } catch (error) {
    console.error("Error storing user data: ", error);
  }
};

export const getAllUsers = async (limit: number, offset: number) => {
  try {
    const allUsers = await db.select().from(users).limit(limit).offset(offset);
    const total = allUsers.length;
    if (total == 0) return { users: [], total };
    return { users: allUsers, total };
  } catch (error) {
    console.error("Error fetching all users", error);
    return { users: [], total: 0 };
  }
};
