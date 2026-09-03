import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createCircleInvitation } from "@server/data";
import { parseAuthToken } from "@shared/auth";
import { z } from "zod";

const newInvitationSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(400),
  spotsNeeded: z.number().min(1).max(1000),
  incentive: z.string().trim().min(1).max(200),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  const auth = parseAuthToken(req.headers.authorization);
  if (!auth || !auth.isAdmin) return res.status(401).json({ message: "Inicia sesión de personal para continuar." });
  const parsed = newInvitationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Revisa los datos de la invitación e intenta de nuevo." });
  try {
    const circleName = decodeURIComponent(req.query.circleName as string);
    const result = await createCircleInvitation(circleName, parsed.data);
    if (!result.ok) return res.status(404).json({ message: result.message });
    res.json(result.invitation);
  } catch (error) {
    console.error("Create circle invitation error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}