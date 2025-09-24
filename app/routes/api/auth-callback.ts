// This file runs ONLY on the server.
// It handles the logic of finding or creating a user in the database.

import { getExistingUser, storeUserData } from "~/lib/auth";
import { getAuth } from "@clerk/react-router/ssr.server";
import type { ClientLoaderFunctionArgs } from "react-router";

export async function loader(args: ClientLoaderFunctionArgs) {
  // The exact signature depends on your server framework
  try {
    // We get the user session on the server
    const user = await getAuth(args);

    if (!user.userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // All database logic happens safely on the server
    const existingUser = await getExistingUser(user.userId);
    const result = existingUser?.accountId
      ? existingUser
      : await storeUserData(user.userId);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (e) {
    console.log("API Error", e);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
