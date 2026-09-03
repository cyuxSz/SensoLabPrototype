import { getAdminOverview } from "@server/data";
import { parseAuthToken } from "@shared/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });
  try {
    const auth = parseAuthToken(req.headers.authorization);
    if (!auth || !auth.isAdmin) return res.status(401).json({ message: "Inicia sesión de personal para continuar." });
    res.json(await getAdminOverview());
  } catch (error) {
    console.error("Get admin overview error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}