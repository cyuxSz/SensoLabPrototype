import { login } from "@server/data";
import { parseAuthToken } from "@shared/auth";

`n`nimport type { VercelRequest, VercelResponse } from "@vercel/node";`n`nexport default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  try {
    const snapshot = await login(req.body);
    if (!snapshot) return res.status(401).json({ message: "Correo o contraseña incorrectos." });
    const email = req.body.email;
    res.json({ snapshot, token: `demo-${email}` });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

