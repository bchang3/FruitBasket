import type { NextApiRequest, NextApiResponse } from "next";
import { RowDataPacket } from "mysql2";
import pool from "@/db/connection";
import { getSessionUsername } from "@/lib/utils/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const username = await getSessionUsername(req);
  if (!username) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT q.questionID, q.questionText, q.answerOptionID, c.categoryName
       FROM Question q
       JOIN Category c ON q.categoryID = c.categoryID
       WHERE FIND_IN_SET(LOWER(c.categoryName), LOWER(?))`,
      [req.query.categories],
    );
    const questions = rows.map((row) => ({
      questionID: row.questionID,
      questionText: row.questionText,
      questionCategory: row.categoryName,
      questionAnswer: row.answerOptionID,
    }));
    return res.status(200).json(questions);
  } catch (error) {
    console.error("Error getting single player questions", error);
    return res.status(500).json({ message: "Error getting questions!" });
  }
}
