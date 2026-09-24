import type { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";
import { getSessionUsername } from "@/lib/utils/auth";
import { Flashcard } from "@/utils/utils";
dotenv.config();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const username = await getSessionUsername(req);
  if (!username) {
    return res.status(401).json({ message: "Not logged in" });
  }
  const questionID = req.body.questionID;

  try {
    const backendRes = await fetch(
      `${process.env.SERVER_HOST}/api/user/flashcards/addFlashcard`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, questionID }),
      },
    );
    const data = await backendRes.json();
    return res.status(200).json({ message: "Add flashcard successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Error in add flashcard!" });
  }
}
