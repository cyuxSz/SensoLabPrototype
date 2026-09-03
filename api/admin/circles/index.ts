import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createCircle } from "@server/data";
import { parseAuthToken } from "@shared/auth";
import { toNullableString } from "@shared/request";
import { z } from "zod";

const newCircleSchema = z.object({
  name: z.string().trim().min(1).max(60),
  description: z.string().trim().min(1).max(300),
  funFacts: z.array(z.string().trim().min(1).max(300)).max(8),
  limit: z.number().min(1).max(1000),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  const auth = parseAuthToken(toNullableString(req.headers.authorization));
  if (!auth || !auth.isAdmin) return res.status(401).json({ message: "Inicia sesión de personal para continuar." });
  const parsed = newCircleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Revisa los datos del círculo e intenta de nuevo." });
  try {
    const result = await createCircle(parsed.data);
    if (!result.ok) return res.status(409).json({ message: result.message });
    res.json(result.circle);
  } catch (error) {
    console.error("Create circle error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}