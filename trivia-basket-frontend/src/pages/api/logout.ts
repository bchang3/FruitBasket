import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  res.setHeader(
    "Set-Cookie",
    serialize("loginToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    }),
  );

  return res.status(200).json({ message: "Logged out" });
}
