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
  const categories: string[] = req.body.categories;
  const questionIDs: number[] = req.body.questionIDs;
  if (!Array.isArray(categories) || categories.length === 0) {
    return res.status(400).json({ message: "Pick at least one category!" });
  }
  if (!Array.isArray(questionIDs) || questionIDs.length === 0) {
    return res.status(400).json({ message: "No questions selected!" });
  }

  try {
    const gameID = Math.floor(Date.now() / 1000);
    // questions are picked client side, so initialize with none and
    // record the chosen ones afterwards
    await pool.query("CALL initializeGame(?, ?, ?, ?)", [
      categories.join(","),
      username,
      0,
      gameID,
    ]);
    await pool.query(
      "INSERT INTO GameQuestions (gameID, questionID) VALUES ?",
      [questionIDs.map((questionID) => [gameID, questionID])],
    );
    return res.status(200).json({ gameID });
  } catch (error) {
    console.error("Error starting single player game", error);
    return res.status(500).json({ message: "Error starting game!" });
  }
}
