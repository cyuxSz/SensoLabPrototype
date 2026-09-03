import type { VercelRequest, VercelResponse } from "@vercel/node";
import { completeChallengeById } from "@server/data";
import { parseAuthToken } from "@shared/auth";
import { toNullableString } from "@shared/request";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  try {
    const auth = parseAuthToken(toNullableString(req.headers.authorization));
    if (!auth || auth.isAdmin) return res.status(401).json({ message: "Inicia sesión para continuar." });
    const challengeId = toNullableString(req.query.challengeId);
    if (!challengeId) return res.status(400).json({ message: "Falta el identificador del reto." });
    const result = await completeChallengeById(auth.email, challengeId);
    if (!result) return res.status(404).json({ message: "Ese reto demo no existe." });
    res.json(result);
  } catch (error) {
    console.error("Complete challenge error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}