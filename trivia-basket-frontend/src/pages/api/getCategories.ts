import type { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";
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
      `${process.env.SERVER_HOST}/api/categories`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = await backendRes.json();
    return res
      .status(200)
      .json(
        data.map((category: { categoryName: string }) => category.categoryName),
      );
  } catch (error) {
    return res.status(500).json({ message: "Error in login!" });
  }
}
