import type { VercelRequest, VercelResponse } from "@vercel/node";
import { reserveCircleInvitation } from "@server/data";
import { parseAuthToken } from "@shared/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  try {
    const auth = parseAuthToken(req.headers.authorization);
    if (!auth || auth.isAdmin) return res.status(401).json({ message: "Inicia sesión para continuar." });
    const circleName = decodeURIComponent(req.query.circleName as string);
    const invitationId = req.query.invitationId as string;
    const result = await reserveCircleInvitation(auth.email, circleName, invitationId);
    if (!result) return res.status(404).json({ message: "Esa invitación de círculo no existe." });
    res.json(result);
  } catch (error) {
    console.error("Reserve circle invitation error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}