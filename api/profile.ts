import type { VercelRequest, VercelResponse } from "@vercel/node";
import { updateProfile } from "@server/data";
import { parseAuthToken } from "@shared/auth";
import { toNullableString } from "@shared/request";
import { z } from "zod";

const profileUpdateSchema = z.object({
  name: z.string().trim().min(1).max(60).optional(),
  city: z.string().trim().min(1).max(60).optional(),
  bio: z.string().trim().max(220).optional(),
  interests: z.array(z.string().trim().min(1).max(40)).max(8).optional(),
  notifyByEmail: z.boolean().optional(),
  notifyByWhatsapp: z.boolean().optional(),
  density: z.enum(["comfortable", "compact"]).optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "PATCH") return res.status(405).json({ message: "Method not allowed" });
  const parsed = profileUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Revisa los datos del perfil e intenta de nuevo." });
  try {
    const auth = parseAuthToken(toNullableString(req.headers.authorization));
    if (!auth || auth.isAdmin) return res.status(401).json({ message: "Inicia sesión para continuar." });
    const result = await updateProfile(auth.email, parsed.data);
    if (!result) return res.status(401).json({ message: "Inicia sesión para continuar." });
    res.json(result);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}