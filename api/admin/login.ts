import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminLogin } from "@server/data";
import { z } from "zod";

const adminLoginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1) });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  const parsed = adminLoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Ingresa un correo y contraseña válidos." });
  try {
    const ok = await adminLogin(parsed.data);
    if (!ok) return res.status(401).json({ message: "Correo o contraseña incorrectos." });
    res.json({ ok: true, token: "admin" });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}