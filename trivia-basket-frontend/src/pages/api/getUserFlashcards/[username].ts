import type { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";
import { Flashcard } from "@/utils/utils";
dotenv.config();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const backendRes = await fetch(
      `${process.env.SERVER_HOST}/api/user/flashcards/${req.query.username}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = await backendRes.json();
    return res.status(200).json(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.map((row: any) => {
        return {
          questionID: row.questionID,
          questionText: row.questionText,
          categoryName: row.CategoryName,
          answerText: row.optionValue,
          priority: row.priority,
        } as Flashcard;
      }),
    );
  } catch (error) {
    return res.status(500).json({ message: "Error in get user flashcards!" });
  }
}
