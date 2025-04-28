import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { SignJWT } from "jose";
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
  const { username, password } = req.body;

  try {
    const backendRes = await fetch(`${process.env.SERVER_HOST}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
    const data = await backendRes.json();
    let result = false;
    let profile_icon = "";
    let profile_color = "";
    let elo = 0;
    if (data.length == 1) {
      result = data[0].password == password;
      profile_icon = data[0].fruitIcon;
      profile_color = data[0].iconBackgroundColor;
      elo = data[0].elo;
    }

    if (result) {
      const token = await new SignJWT({
        username: username,
        profile_icon: profile_icon,
        profile_color: profile_color,
        elo: elo,
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

      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error in login!" });
  }
}
