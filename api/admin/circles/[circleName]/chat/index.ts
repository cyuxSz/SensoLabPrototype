import { getCircleChatForAdmin, postAnnouncementAsAdmin, deleteChatMessageAsAdmin } from "@server/data";
import { parseAuthToken } from "@shared/auth";
import { z } from "zod";

const announcementSchema = z.object({ text: z.string().trim().min(1).max(500) });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = parseAuthToken(req.headers.authorization);
  if (!auth || !auth.isAdmin) return res.status(401).json({ message: "Inicia sesión de personal para continuar." });
  const circleName = decodeURIComponent(req.query.circleName as string);

  if (req.method === "GET") {
    try {
      res.json({ messages: await getCircleChatForAdmin(circleName) });
    } catch (error) {
      console.error("Get circle chat for admin error:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
    return;
  }

  if (req.method === "POST") {
    const parsed = announcementSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "El anuncio no puede estar vacío." });
    try {
      const result = await postAnnouncementAsAdmin(circleName, parsed.data.text);
      if (!result.ok) return res.status(404).json({ message: result.message2 });
      res.json(result.message);
    } catch (error) {
      console.error("Post announcement error:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
    return;
  }

  if (req.method === "DELETE") {
    const messageId = req.query.messageId as string;
    try {
      const removed = await deleteChatMessageAsAdmin(circleName, messageId);
      if (!removed) return res.status(404).json({ message: "Ese mensaje no existe." });
      res.json({ ok: true });
    } catch (error) {
      console.error("Delete chat message error:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
    return;
  }

  res.status(405).json({ message: "Method not allowed" });
}