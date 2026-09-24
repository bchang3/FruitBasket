import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/db/connection";
import { getSessionUsername } from "@/lib/utils/auth";

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
  const { gameID, questionID, userAnswer, points, createdAt } = req.body;

  try {
    const questionInstanceID = Math.floor(Date.now() / 1000);
    await pool.query("CALL createQuestionInstance(?,?,?,?,?,?,?,?)", [
      questionInstanceID,
      new Date(createdAt),
      new Date(),
      points,
      questionID,
      gameID,
      username,
      userAnswer,
    ]);
    return res.status(200).json({ message: "Saved answer!" });
  } catch (error) {
    console.error("Error saving single player answer", error);
    return res.status(500).json({ message: "Error saving answer!" });
  }
}
