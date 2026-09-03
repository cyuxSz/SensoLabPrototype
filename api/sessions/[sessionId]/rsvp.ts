import type { VercelRequest, VercelResponse } from "@vercel/node";
import { reserveSession } from "@server/data";
import { parseAuthToken } from "@shared/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  try {
    const auth = parseAuthToken(req.headers.authorization);
    if (!auth || auth.isAdmin) return res.status(401).json({ message: "Inicia sesión para continuar." });
    const sessionId = req.query.sessionId as string;
    const result = await reserveSession(auth.email, sessionId);
    if (!result) return res.status(404).json({ message: "Esa sesión demo no existe." });
    res.json(result);
  } catch (error) {
    console.error("Reserve session error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}