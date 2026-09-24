import type { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";
import { getSessionUsername } from "@/lib/utils/auth";
import { Flashcard, UserCategoryStat } from "@/utils/utils";
dotenv.config();

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
  if (req.query.username !== username) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const backendRes = await fetch(
      `${process.env.SERVER_HOST}/api/user/stats/${encodeURIComponent(username)}`,
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
      data.map((packet: any) => {
        return {
          ...packet,
          accuracy: parseFloat(packet.accuracy),
        } as UserCategoryStat;
      }),
    );
  } catch (error) {
    return res.status(500).json({ message: "Error in get user flashcards!" });
  }
}
