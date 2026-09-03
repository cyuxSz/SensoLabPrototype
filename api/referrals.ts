import type { VercelRequest, VercelResponse } from "@vercel/node";
import { addReferral } from "@server/data";
import { parseAuthToken } from "@shared/auth";
import { toNullableString } from "@shared/request";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  try {
    const auth = parseAuthToken(toNullableString(req.headers.authorization));
    if (!auth || auth.isAdmin) return res.status(401).json({ message: "Inicia sesión para continuar." });
    const result = await addReferral(auth.email);
    if (!result) return res.status(401).json({ message: "Inicia sesión para continuar." });
    res.json(result);
  } catch (error) {
    console.error("Add referral error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}