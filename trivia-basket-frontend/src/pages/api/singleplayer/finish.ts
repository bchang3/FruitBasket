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

  try {
    await pool.query("UPDATE Game SET isFinished=1 WHERE gameID=?", [
      req.body.gameID,
    ]);
    return res.status(200).json({ message: "Game finished!" });
  } catch (error) {
    console.error("Error finishing single player game", error);
    return res.status(500).json({ message: "Error finishing game!" });
  }
}
