import cors from "cors";
import express from "express";
import { z } from "zod";
import { config } from "dotenv";
import {
  addReferral,
  adminLogin,
  adminLogout,
  completeChallengeById,
  createCircle,
  createCircleInvitation,
  deleteChatMessageAsAdmin,
  getAdminOverview,
  getCircleChatForAdmin,
  getPendingCircle,
  getSnapshot,
  initializeData,
  isAdminAuthenticated,
  joinCircleByName,
  joinPendingCircle,
  login,
  logout,
  postAnnouncementAsAdmin,
  recordCheckIn,
  redeemReward,
  reserveCircleInvitation,
  reserveSession,
  signup,
  suggestCircle,
  toggleReaction,
  updateProfile,
} from "./data.js";
import { REACTION_EMOJIS } from "./types.js";
import { parseAuthToken } from "../../shared/auth.js";

config({ path: "../.env" });

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

// Initialize data on startup
initializeData().then(() => {
  console.log("✅ Data initialized");
}).catch((err) => {
  console.error("❌ Failed to initialize data:", err);
});

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", service: "sensolab-passport-api" });
});

function extractEmail(request: express.Request): string | null {
  const auth = parseAuthToken(request.headers.authorization ?? null);
  if (!auth || auth.isAdmin) return null;
  return auth.email;
}

function requireAuth(request: express.Request, response: express.Response, next: express.NextFunction) {
  const email = extractEmail(request);
  if (!email) {
    response.status(401).json({ message: "Inicia sesión para continuar." });
    return;
  }
  (request as any).userEmail = email;
  next();
}

function requireAdminAuth(request: express.Request, response: express.Response, next: express.NextFunction) {
  const auth = parseAuthToken(request.headers.authorization ?? null);
  if (!auth || !auth.isAdmin) {
    response.status(401).json({ message: "Inicia sesión de personal para continuar." });
    return;
  }
  next();
}

// ---- Member auth ----

const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1) });

app.post("/api/auth/login", async (request, response) => {
  const parsed = loginSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ message: "Ingresa un correo y contraseña válidos." });
    return;
  }
  try {
    const snapshot = await login(parsed.data);
    if (!snapshot) {
      response.status(401).json({ message: "Correo o contraseña incorrectos." });
      return;
    }
    response.json({ snapshot, token: `demo-${parsed.data.email}` });
  } catch (error) {
    console.error("Login error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

app.post("/api/auth/logout", async (request, response) => {
  const email = extractEmail(request);
  if (email) await logout(email);
  response.json({ ok: true });
});

const signupSchema = z.object({
  name: z.string().trim().min(1).max(60),
  birthDate: z.string().min(1),
  city: z.string().trim().min(1).max(60),
  email: z.string().trim().email(),
  password: z.string().min(4).max(100),
  categories: z.array(z.string()).min(1),
  dietary: z.array(z.string()),
  spiceSensitivity: z.number().min(1).max(5),
  sessionFormatPref: z.enum(["individual", "group", "either"]),
  frequencyPref: z.enum(["weekly", "monthly", "occasional"]),
});

app.post("/api/auth/signup", async (request, response) => {
  const parsed = signupSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ message: "Revisa los datos del formulario e intenta de nuevo." });
    return;
  }
  try {
    const result = await signup(parsed.data);
    if (!result.ok) {
      response.status(409).json({ message: result.message });
      return;
    }
    response.json({ snapshot: result.snapshot, suggestion: result.suggestion, token: `demo-${parsed.data.email}` });
  } catch (error) {
    console.error("Signup error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

const suggestSchema = z.object({ categories: z.array(z.string()), dietary: z.array(z.string()) });

app.post("/api/onboarding/suggest-circle", async (request, response) => {
  const parsed = suggestSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ message: "Faltan datos para sugerir un círculo." });
    return;
  }
  try {
    response.json(await suggestCircle(parsed.data));
  } catch (error) {
    console.error("Suggest circle error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

app.get("/api/onboarding/pending-circle", requireAuth, async (request, response) => {
  try {
    const email = (request as any).userEmail;
    response.json({ pendingCircle: await getPendingCircle(email) });
  } catch (error) {
    console.error("Get pending circle error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

app.post("/api/onboarding/join-circle", requireAuth, async (request, response) => {
  try {
    const email = (request as any).userEmail;
    const snapshot = await joinPendingCircle(email);
    if (!snapshot) {
      response.status(400).json({ message: "No hay un círculo pendiente por confirmar." });
      return;
    }
    response.json(snapshot);
  } catch (error) {
    console.error("Join circle error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

// ---- Member data ----

app.get("/api/dashboard", requireAuth, async (request, response) => {
  try {
    const email = (request as any).userEmail;
    response.json(await getSnapshot(email));
  } catch (error) {
    console.error("Get snapshot error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

app.get("/api/sessions", requireAuth, async (request, response) => {
  try {
    const email = (request as any).userEmail;
    const snapshot = await getSnapshot(email);
    response.json({ sessions: snapshot.sessions });
  } catch (error) {
    console.error("Get sessions error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

app.post("/api/sessions/:sessionId/rsvp", requireAuth, async (request, response) => {
  try {
    const email = (request as any).userEmail;
    const result = await reserveSession(email, request.params.sessionId);
    if (!result) {
      response.status(404).json({ message: "Esa sesión demo no existe." });
      return;
    }
    response.json(result);
  } catch (error) {
    console.error("Reserve session error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

app.post("/api/circles/:circleName/join", requireAuth, async (request, response) => {
  try {
    const email = (request as any).userEmail;
    const result = await joinCircleByName(email, decodeURIComponent(request.params.circleName));
    if (!result) {
      response.status(400).json({ message: "No fue posible unirte a ese círculo (no existe o está lleno)." });
      return;
    }
    response.json(result);
  } catch (error) {
    console.error("Join circle error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

app.post("/api/circles/:circleName/invitations/:invitationId/rsvp", requireAuth, async (request, response) => {
  try {
    const email = (request as any).userEmail;
    const result = await reserveCircleInvitation(email, decodeURIComponent(request.params.circleName), request.params.invitationId);
    if (!result) {
      response.status(404).json({ message: "Esa invitación de círculo no existe." });
      return;
    }
    response.json(result);
  } catch (error) {
    console.error("Reserve circle invitation error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

const reactSchema = z.object({ emoji: z.enum(REACTION_EMOJIS) });

app.post("/api/circles/:circleName/chat/:messageId/react", requireAuth, async (request, response) => {
  const parsed = reactSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ message: "Reacción no válida." });
    return;
  }
  try {
    const email = (request as any).userEmail;
    const result = await toggleReaction(email, decodeURIComponent(request.params.circleName), request.params.messageId, parsed.data.emoji);
    if (!result) {
      response.status(400).json({ message: "No se pudo registrar tu reacción." });
      return;
    }
    response.json(result);
  } catch (error) {
    console.error("Toggle reaction error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

app.post("/api/referrals", requireAuth, async (request, response) => {
  try {
    const email = (request as any).userEmail;
    const result = await addReferral(email);
    if (!result) {
      response.status(401).json({ message: "Inicia sesión para continuar." });
      return;
    }
    response.json(result);
  } catch (error) {
    console.error("Add referral error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

const checkInSchema = z.object({ code: z.string().trim().toUpperCase() });

app.post("/api/check-ins", requireAuth, async (request, response) => {
  const parsed = checkInSchema.safeParse(request.body);
  if (!parsed.success || parsed.data.code !== "SENSO-042") {
    response.status(400).json({ message: "Use the demo study code SENSO-042." });
    return;
  }
  try {
    const email = (request as any).userEmail;
    const result = await recordCheckIn(email);
    if (!result) {
      response.status(401).json({ message: "Inicia sesión para continuar." });
      return;
    }
    response.json(result);
  } catch (error) {
    console.error("Record check-in error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

app.post("/api/challenges/:challengeId/complete", requireAuth, async (request, response) => {
  try {
    const email = (request as any).userEmail;
    const result = await completeChallengeById(email, request.params.challengeId);
    if (!result) {
      response.status(404).json({ message: "Ese reto demo no existe." });
      return;
    }
    response.json(result);
  } catch (error) {
    console.error("Complete challenge error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

app.post("/api/rewards/:rewardId/redeem", requireAuth, async (request, response) => {
  try {
    const email = (request as any).userEmail;
    const result = await redeemReward(email, request.params.rewardId);
    if (!result.ok) {
      response.status(400).json({ message: result.message });
      return;
    }
    response.json({ snapshot: result.snapshot, reward: result.reward, code: result.code });
  } catch (error) {
    console.error("Redeem reward error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

const profileUpdateSchema = z.object({
  name: z.string().trim().min(1).max(60).optional(),
  city: z.string().trim().min(1).max(60).optional(),
  bio: z.string().trim().max(220).optional(),
  interests: z.array(z.string().trim().min(1).max(40)).max(8).optional(),
  notifyByEmail: z.boolean().optional(),
  notifyByWhatsapp: z.boolean().optional(),
  density: z.enum(["comfortable", "compact"]).optional(),
});

app.patch("/api/profile", requireAuth, async (request, response) => {
  const parsed = profileUpdateSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ message: "Revisa los datos del perfil e intenta de nuevo." });
    return;
  }
  try {
    const email = (request as any).userEmail;
    const result = await updateProfile(email, parsed.data);
    if (!result) {
      response.status(401).json({ message: "Inicia sesión para continuar." });
      return;
    }
    response.json(result);
  } catch (error) {
    console.error("Update profile error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

// ---- Admin (SensoLab staff) ----

const adminLoginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1) });

app.post("/api/admin/login", async (request, response) => {
  const parsed = adminLoginSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ message: "Ingresa un correo y contraseña válidos." });
    return;
  }
  try {
    const ok = await adminLogin(parsed.data);
    if (!ok) {
      response.status(401).json({ message: "Correo o contraseña incorrectos." });
      return;
    }
    response.json({ ok: true, token: "admin" });
  } catch (error) {
    console.error("Admin login error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

app.post("/api/admin/logout", async (request, response) => {
  try {
    await adminLogout();
    response.json({ ok: true });
  } catch (error) {
    console.error("Admin logout error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

app.get("/api/admin/overview", requireAdminAuth, async (request, response) => {
  try {
    response.json(await getAdminOverview());
  } catch (error) {
    console.error("Get admin overview error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

const newCircleSchema = z.object({
  name: z.string().trim().min(1).max(60),
  description: z.string().trim().min(1).max(300),
  funFacts: z.array(z.string().trim().min(1).max(300)).max(8),
  limit: z.number().min(1).max(1000),
});

app.post("/api/admin/circles", requireAdminAuth, async (request, response) => {
  const parsed = newCircleSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ message: "Revisa los datos del círculo e intenta de nuevo." });
    return;
  }
  try {
    const result = await createCircle(parsed.data);
    if (!result.ok) {
      response.status(409).json({ message: result.message });
      return;
    }
    response.json(result.circle);
  } catch (error) {
    console.error("Create circle error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

const newInvitationSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(400),
  spotsNeeded: z.number().min(1).max(1000),
  incentive: z.string().trim().min(1).max(200),
});

app.post("/api/admin/circles/:circleName/invitations", requireAdminAuth, async (request, response) => {
  const parsed = newInvitationSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ message: "Revisa los datos de la invitación e intenta de nuevo." });
    return;
  }
  try {
    const result = await createCircleInvitation(decodeURIComponent(request.params.circleName), parsed.data);
    if (!result.ok) {
      response.status(404).json({ message: result.message });
      return;
    }
    response.json(result.invitation);
  } catch (error) {
    console.error("Create circle invitation error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

app.get("/api/admin/circles/:circleName/chat", requireAdminAuth, async (request, response) => {
  try {
    response.json({ messages: await getCircleChatForAdmin(decodeURIComponent(request.params.circleName)) });
  } catch (error) {
    console.error("Get circle chat for admin error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

const announcementSchema = z.object({ text: z.string().trim().min(1).max(500) });

app.post("/api/admin/circles/:circleName/chat", requireAdminAuth, async (request, response) => {
  const parsed = announcementSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ message: "El anuncio no puede estar vacío." });
    return;
  }
  try {
    const result = await postAnnouncementAsAdmin(decodeURIComponent(request.params.circleName), parsed.data.text);
    if (!result.ok) {
      response.status(404).json({ message: result.message2 });
      return;
    }
    response.json(result.message);
  } catch (error) {
    console.error("Post announcement error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

app.delete("/api/admin/circles/:circleName/chat/:messageId", requireAdminAuth, async (request, response) => {
  try {
    const removed = await deleteChatMessageAsAdmin(decodeURIComponent(request.params.circleName), request.params.messageId);
    if (!removed) {
      response.status(404).json({ message: "Ese mensaje no existe." });
      return;
    }
    response.json({ ok: true });
  } catch (error) {
    console.error("Delete chat message error:", error);
    response.status(500).json({ message: "Error interno del servidor" });
  }
});

app.use((_request, response) => {
  response.status(404).json({ message: "Ruta de la API demo no encontrada." });
});

app.listen(port, () => {
  console.log(`SensoLab Sensory Passport API listening on http://localhost:${port}`);
});