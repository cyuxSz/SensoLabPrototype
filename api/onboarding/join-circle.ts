import type { VercelRequest, VercelResponse } from "@vercel/node";
import { joinPendingCircle } from "@server/data";
import { parseAuthToken } from "@shared/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  try {
    const auth = parseAuthToken(req.headers.authorization);
    if (!auth || auth.isAdmin) return res.status(401).json({ message: "Inicia sesión para continuar." });
    const snapshot = await joinPendingCircle(auth.email);
    if (!snapshot) return res.status(400).json({ message: "No hay un círculo pendiente por confirmar." });
    res.json(snapshot);
  } catch (error) {
    console.error("Join circle error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}