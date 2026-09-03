import type { VercelRequest, VercelResponse } from "@vercel/node";
import { joinCircleByName } from "@server/data";
import { parseAuthToken } from "@shared/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  try {
    const auth = parseAuthToken(req.headers.authorization);
    if (!auth || auth.isAdmin) return res.status(401).json({ message: "Inicia sesión para continuar." });
    const circleName = decodeURIComponent(req.query.circleName as string);
    const result = await joinCircleByName(auth.email, circleName);
    if (!result) return res.status(400).json({ message: "No fue posible unirte a ese círculo (no existe o está lleno)." });
    res.json(result);
  } catch (error) {
    console.error("Join circle error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}