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
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const profileIcon = req.body.profileIcon;
  const profileColor = req.body.profileColor;
  try {
    const loginToken = req.cookies["loginToken"];
    let loggedIn: boolean;
    if (loginToken) {
      try {
        const { payload } = await jwtVerify(loginToken, SECRET_KEY); // Verify JWT
        loggedIn = payload.loggedIn === true;
        const username = payload.username;
        const password = payload.password;
        const backendRes = await fetch(
          `${process.env.SERVER_HOST}/api/updateProfileImage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, profileIcon, profileColor }),
          },
        );
        const data = await backendRes.json();
        const token = await new SignJWT({
          username: username,
          profile_icon: profileIcon,
          profile_color: profileColor,
          password: password,
          loggedIn: true,
          issuedAt: Date.now() / 1000,
        })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("1d")
          .sign(SECRET_KEY);

        res.setHeader(
          "Set-Cookie",
          serialize("loginToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
          }),
        );
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Update user profile image failed!" });
      }
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res
      .status(200)
      .json({ message: "User profile image updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in update user profile image!" });
  }
}
