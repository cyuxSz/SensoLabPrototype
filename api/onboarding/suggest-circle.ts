import type { VercelRequest, VercelResponse } from "@vercel/node";
import { suggestCircle } from "@server/data";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  try {
    res.json(await suggestCircle(req.body));
  } catch (error) {
    console.error("Suggest circle error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}