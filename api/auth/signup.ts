import { signup } from "@server/data";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  try {
    const result = await signup(req.body);
    if (!result.ok) return res.status(409).json({ message: result.message });
    res.json({ snapshot: result.snapshot, suggestion: result.suggestion, token: `demo-${req.body.email}` });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}