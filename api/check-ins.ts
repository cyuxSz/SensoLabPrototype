import type { VercelRequest, VercelResponse } from "@vercel/node";
import { recordCheckIn } from "@server/data";
import { parseAuthToken } from "@shared/auth";
import { toNullableString } from "@shared/request";
import { z } from "zod";

const checkInSchema = z.object({ code: z.string().trim().toUpperCase() });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  const parsed = checkInSchema.safeParse(req.body);
  if (!parsed.success || parsed.data.code !== "SENSO-042") {
    return res.status(400).json({ message: "Use the demo study code SENSO-042." });
  }
  try {
    const auth = parseAuthToken(toNullableString(req.headers.authorization));
    if (!auth || auth.isAdmin) return res.status(401).json({ message: "Inicia sesión para continuar." });
    const result = await recordCheckIn(auth.email);
    if (!result) return res.status(401).json({ message: "Inicia sesión para continuar." });
    res.json(result);
  } catch (error) {
    console.error("Record check-in error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}