import type { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";
import { Flashcard } from "@/utils/utils";
dotenv.config();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const username = req.body.username;
  const search = req.body.search;

  try {
    const backendRes = await fetch(
      `${process.env.SERVER_HOST}/api/user/flashcards/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, search }),
      },
    );
    const data = await backendRes.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Error in add flashcard!" });
  }
}
