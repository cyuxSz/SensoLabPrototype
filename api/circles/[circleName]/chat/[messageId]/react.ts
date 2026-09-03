import { toggleReaction } from "@server/data";
import { parseAuthToken, REACTION_EMOJIS } from "@shared/auth";
import { z } from "zod";

const reactSchema = z.object({ emoji: z.enum(REACTION_EMOJIS) });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  const parsed = reactSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Reacción no válida." });
  
  try {
    const auth = parseAuthToken(req.headers.authorization);
    if (!auth || auth.isAdmin) return res.status(401).json({ message: "Inicia sesión para continuar." });
    const circleName = decodeURIComponent(req.query.circleName as string);
    const messageId = req.query.messageId as string;
    const result = await toggleReaction(auth.email, circleName, messageId, parsed.data.emoji);
    if (!result) return res.status(400).json({ message: "No se pudo registrar tu reacción." });
    res.json(result);
  } catch (error) {
    console.error("Toggle reaction error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}