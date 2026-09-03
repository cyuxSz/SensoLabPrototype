import { logout } from "@server/data";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  try {
    // Client-side token clearing is sufficient for stateless auth
    await logout(req.body.email || "");
    res.json({ ok: true });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}