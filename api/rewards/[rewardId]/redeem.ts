import type { VercelRequest, VercelResponse } from "@vercel/node";
import { redeemReward } from "@server/data";
import { parseAuthToken } from "@shared/auth";
import { toNullableString } from "@shared/request";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  try {
    const auth = parseAuthToken(toNullableString(req.headers.authorization));
    if (!auth || auth.isAdmin) return res.status(401).json({ message: "Inicia sesión para continuar." });
    const rewardId = toNullableString(req.query.rewardId);
    if (!rewardId) return res.status(400).json({ message: "Falta el identificador de la recompensa." });
    const result = await redeemReward(auth.email, rewardId);
    if (!result.ok) return res.status(400).json({ message: result.message });
    res.json({ snapshot: result.snapshot, reward: result.reward, code: result.code });
  } catch (error) {
    console.error("Redeem reward error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}