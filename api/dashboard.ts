import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSnapshot } from "@server/data";
import { parseAuthToken } from "@shared/auth";
import { toNullableString } from "@shared/request";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });
  try {
    const auth = parseAuthToken(toNullableString(req.headers.authorization));
    if (!auth || auth.isAdmin) return res.status(401).json({ message: "Inicia sesión para continuar." });
    res.json(await getSnapshot(auth.email));
  } catch (error) {
    console.error("Get snapshot error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}