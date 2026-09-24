import type { NextApiRequest, NextApiResponse } from "next";
import { RowDataPacket } from "mysql2";
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
  const categories: string[] = req.body.categories;
  const numRounds: number = req.body.numRounds;
  if (!Array.isArray(categories) || categories.length === 0) {
    return res.status(400).json({ message: "Pick at least one category!" });
  }

  try {
    const gameID = Math.floor(Date.now() / 1000);
    await pool.query("CALL initializeGame(?, ?, ?, ?)", [
      categories.join(","),
      username,
      numRounds,
      gameID,
    ]);
    const [results] = await pool.query<RowDataPacket[][]>(
      "CALL getGameQuestions(?)",
      [gameID],
    );
    const questions = results[0].map((row) => ({
      questionID: row.questionID,
      questionText: row.questionText,
      questionCategory: row.categoryName,
      questionAnswer: row.answerOptionID,
    }));
    return res.status(200).json({ gameID, questions });
  } catch (error) {
    console.error("Error starting single player game", error);
    return res.status(500).json({ message: "Error starting game!" });
  }
}
