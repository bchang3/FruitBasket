import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { SignJWT } from "jose";
import { jwtVerify } from "jose";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = new TextEncoder().encode(process.env.SERVER_SIGN_KEY); // Encode the key

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    const loginToken = req.cookies["loginToken"];
    let loggedIn: boolean;
    if (loginToken) {
      try {
        const { payload } = await jwtVerify(loginToken, SECRET_KEY); // Verify JWT
        loggedIn = payload.loggedIn === true;
        return res.status(200).json({
          username: payload.username,
          password: payload.password,
          profile_icon: payload.profile_icon,
          profile_color: payload.profile_color,
        });
      } catch (error) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ message: "Error in login!" });
  }
}
