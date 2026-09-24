import type { NextApiRequest, NextApiResponse } from "next";
import { RowDataPacket } from "mysql2";
import pool from "@/db/connection";
import { QuestionOption } from "@/utils/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const [results] = await pool.query<RowDataPacket[][]>(
      "CALL getQuestionOptions(?)",
      [req.query.questionID],
    );
    const options: QuestionOption[] = results[0].map((row) => ({
      questionOptionID: row.questionOptionID,
      questionOptionLabel: row.optionLabel,
      questionOptionText: row.optionValue,
    }));
    return res.status(200).json(options);
  } catch (error) {
    console.error("Error getting question options", error);
    return res.status(500).json({ message: "Error getting options!" });
  }
}
