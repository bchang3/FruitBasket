import type { NextApiRequest } from "next";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.SERVER_SIGN_KEY);

/**
 * API routes are excluded from middleware, so each route that acts on a
 * user must derive the username from the signed login token itself.
 * @returns the logged-in username, or null if the token is missing/invalid
 */
export async function getSessionUsername(
  req: NextApiRequest,
): Promise<string | null> {
  const loginToken = req.cookies["loginToken"];
  if (!loginToken) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(loginToken, SECRET_KEY);
    if (payload.loggedIn !== true || typeof payload.username !== "string") {
      return null;
    }
    return payload.username;
  } catch {
    return null;
  }
}
