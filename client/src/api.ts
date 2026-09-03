import type {
  AdminLoginInput,
  AdminOverview,
  CircleDefinition,
  CircleSuggestion,
  LoginInput,
  NewCircleInput,
  NewCircleInvitationInput,
  ProfileUpdate,
  SignupInput,
  Snapshot,
  Reward,
  RedeemedReward,
  ChatMessage,
  ReactionSummary,
} from "./types";

export class UnauthorizedError extends Error {}

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

const MOCK_SNAPSHOT: Snapshot = {
  member: {
    name: "Alex Demo",
    birthDate: "1998-04-12",
    city: "Monterrey",
    bio: "Me gusta descubrir sabores y texturas nuevas antes que nadie.",
    joinedDate: "2026-06-05",
    level: "Catador",
    levelProgress: 3,
    nextLevelAt: 5,
    circles: ["Catadores Veganos"],
    interests: ["Alimentos", "Sesiones grupales"],
    notifyByEmail: true,
    notifyByWhatsapp: false,
    sensoryProfile: {
      categories: ["Alimentos", "Bebidas"],
      dietary: ["Vegetariana"],
      spiceSensitivity: 3,
      sessionFormatPref: "group",
      frequencyPref: "monthly",
    },
    density: "comfortable",
  },
  stats: {
    completedStudies: 3,
    activeStreak: 2,
    bestStreak: 4,
    referrals: 1,
    unlockedBenefits: 2,
    sessionsThisYear: 3,
    totalSessionsScheduledThisYear: 6,
    lastCheckIn: null,
    points: 700,
  },
  passportEntries: [
    { id: "study-003", title: "Estudio de Textura Cítrica", category: "Concepto alimenticio", date: "08 ago 2026", contribution: "Tu grupo ayudó al equipo a entender qué textura se sentía más..." },
    { id: "study-002", title: "Comparación de Snacks Plant-Based", category: "Concepto alimenticio", date: "17 jul 2026", contribution: "La sesión comparó aroma, crujido y regusto entre distintos..." },
    { id: "study-001", title: "Descubrimiento de Producto Cotidiano", category: "Sesión comunitaria", date: "05 jun 2026", contribution: "Tu primera visita creó una base para los intereses que se detectaron..." },
  ],
  badges: [
    { id: "explorer", name: "Explorador", description: "Completa tu primer estudio sensorial.", earned: true },
    { id: "taster", name: "Catador", description: "Regresa para tres estudios o sesiones grupales.", earned: true },
    { id: "curator", name: "Curador", description: "Ayuda a dar forma a un concepto o da la bienvenida a un nuevo miembro.", earned: false },
    { id: "streaker", name: "Rachero", description: "Alcanza una racha de 5 estudios seguidos.", earned: false },
    { id: "year-completionist", name: "Asistencia Perfecta", description: "Participa en todos los estudios programados para tu círculo en el año.", earned: false },
  ],
  sessions: [
    { id: "session-004", title: "Laboratorio de Textura y Sabor", category: "Concepto alimenticio", date: "12 sep 2026", time: "10:30 AM", duration: "45 minutos", format: "Grupo pequeño", slotsLeft: 3, incentive: "Muestra", status: "open" },
    { id: "session-005", title: "Estudio de Aroma y Rutina", category: "Cuidado personal", date: "19 sep 2026", time: "12:00 PM", duration: "35 minutos", format: "Sesión individual", slotsLeft: 7, incentive: "Descuento", status: "open" },
    { id: "session-006", title: "Descubrimiento Grupal de Producto", category: "Sesión comunitaria", date: "03 oct 2026", time: "11:00 AM", duration: "60 minutos", format: "Evento de círculo", slotsLeft: 10, incentive: "Premio", status: "open" },
  ],
  challenges: [
    { id: "challenge-streak", title: "Racha de 3 estudios seguidos", description: "Participa en tres estudios o sesiones consecutivas sin perder tu racha.", metric: "streak", progress: 2, target: 3, reward: "badge-streak-3", completed: false },
    { id: "challenge-year", title: "Asiste a todos los estudios del año", description: "Participa en cada estudio programado para tu círculo durante el año.", metric: "sessionsThisYear", progress: 3, target: 12, reward: "reward-year", completed: false },
    { id: "challenge-referrals", title: "Refiere a 5 personas", description: "Invita a 5 personas nuevas y elegibles a unirse a SensoLab.", metric: "referrals", progress: 1, target: 5, reward: "reward-referrals", completed: false },
    { id: "challenge-circle-notes", title: "Haz lo invisible describible", description: "Agrega una nota sensorial al círculo este mes para construir vocabulario compartido.", metric: "circleNotes", progress: 0, target: 1, reward: "", completed: false },
  ],
  myCircles: [
    { name: "Catadores Veganos", description: "Un grupo para quienes disfrutan comparar productos plant-based, texturas y sabores vegetales.", funFacts: ["El 'umami' vegetal se puede reforzar con..."], limit: 150, memberCount: 42 },
  ],
  circleChatByCircle: {
    "Catadores Veganos": [
      { id: "chat-001", authorName: "SensoLab", authorInitials: "SL", text: "📢 Recordatorio: sesión de Laboratorio de Textura y Sabor el 12 de septiembre. ¡Últimos lugares disponibles!", timestamp: new Date().toISOString(), fromMember: false, reactions: [] },
      { id: "chat-002", authorName: "SensoLab", authorInitials: "SL", text: "🎉 ¡Bienvenidos los nuevos miembros de esta semana! Qué gusto tenerlos en Catadores Veganos.", timestamp: new Date().toISOString(), fromMember: false, reactions: [] },
    ],
  },
  circleInvitationsByCircle: {
    "Catadores Veganos": [
      { id: "circle-invite-001", circleName: "Catadores Veganos", title: "Formulación vegana: nueva línea de quesos", description: "SensoLab busca específicamente a integrantes de Catadores Veganos.", category: "Alimentos", spotsNeeded: 5, spotsFilled: 0, incentive: "Insignia", status: "open" },
    ],
  },
  discoverableCircles: [
    { name: "Círculo de Fragancias y Cuidado", description: "Un grupo enfocado en fragancias y cosmética sensorial.", funFacts: ["El olfato humano puede distinguir más de un... "], limit: 150, memberCount: 28 },
    { name: "Descubridores Cotidianos", description: "Un grupo general para quienes quieren descubrir de todo un poco en estudios sensoriales.", funFacts: ["El panel sensorial humano puede distinguir... "], limit: 150, memberCount: 18 },
  ],
  rewards: [
    { id: "reward-priority", title: "Acceso prioritario a tu próxima sesión", description: "Salta al frente de la fila de confirmación en la siguiente invitación que reserves.", partnerName: "SensoLab", discountLabel: "-", costPoints: 300, icon: "star", remaining: 10 },
    { id: "reward-sample", title: "Muestra de producto sorpresa", description: "Una muestra de un producto en evaluación, aprobada para entrega a participantes.", partnerName: "Aliado", discountLabel: "-", costPoints: 200, icon: "box", remaining: 20 },
    { id: "reward-cafe", title: "20% de descuento en tu próxima compra", description: "Válido en toda la tienda en línea de nuestro aliado de café de especialidad.", partnerName: "Café Nuez", discountLabel: "20%", costPoints: 150, icon: "coffee", remaining: 50 },
    { id: "reward-empresax", title: "50% de descuento en toda la página", description: "Convenio especial con Empresa X: la mitad de precio en cualquier producto de su catálogo en línea.", partnerName: "Empresa X", discountLabel: "50%", costPoints: 1200, icon: "tag", remaining: 5 },
    { id: "reward-kit", title: "Kit de bienvenida físico SensoLab", description: "Una caja con artículos de marca y una guía impresa de cómo se hace un estudio sensorial.", partnerName: "SensoLab", discountLabel: "-", costPoints: 500, icon: "box", remaining: 2 },
    { id: "reward-1on1", title: "Sesión 1:1 con el equipo de investigación", description: "Media hora para conocer de primera mano cómo se usan tus contribuciones en el desarrollo de producto.", partnerName: "SensoLab", discountLabel: "-", costPoints: 2500, icon: "user", remaining: 1 },
  ],
  redeemedRewards: [],
};

let CURRENT_SNAPSHOT: Snapshot = clone(MOCK_SNAPSHOT);

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

function findCircleFirstKey(): string {
  const keys = Object.keys(CURRENT_SNAPSHOT.circleChatByCircle);
  return keys.length ? keys[0] : "";
}

function awardBadgeIfNeeded(snapshot: Snapshot) {
  const streakBadge = snapshot.badges.find((b) => b.id === "streaker");
  if (streakBadge && !streakBadge.earned && snapshot.stats.activeStreak >= 3) streakBadge.earned = true as any;
}

function updateLevelProgress(snapshot: Snapshot) {
  const points = snapshot.stats.points || 0;
  snapshot.member.levelProgress = Math.min(snapshot.member.nextLevelAt, Math.floor((points % 1000) / 100));
}

export async function login(input: LoginInput): Promise<{ snapshot: Snapshot; token: string }> {
  await delay(500);
  if (!input.email || !input.password) throw new UnauthorizedError("Ingresa correo y contraseña");
  CURRENT_SNAPSHOT = clone(MOCK_SNAPSHOT);
  return { snapshot: clone(CURRENT_SNAPSHOT), token: `demo-${input.email}` };
}

export async function signup(input: SignupInput): Promise<{ snapshot: Snapshot; suggestion: CircleSuggestion; token: string }> {
  await delay(600);
  if (!input.email || !input.password || !input.name) throw new UnauthorizedError("Completa todos los campos");
  CURRENT_SNAPSHOT = clone(MOCK_SNAPSHOT);
  CURRENT_SNAPSHOT.member.name = input.name;
  return { snapshot: clone(CURRENT_SNAPSHOT), suggestion: { name: "Everyday Discoverers", description: "Sugerencia demo", matchReason: "Reglas demo", funFacts: ["Dato demo"] }, token: `demo-${input.email}` };
}

export async function logout(): Promise<{ ok: boolean }> {
  await delay(100);
  CURRENT_SNAPSHOT = clone(MOCK_SNAPSHOT);
  return { ok: true };
}

export async function getSnapshot(): Promise<Snapshot> {
  await delay(200);
  return clone(CURRENT_SNAPSHOT);
}

export async function joinPendingCircle(): Promise<Snapshot> {
  await delay(400);
  const p = "Pending Circle";
  if (!CURRENT_SNAPSHOT.member.circles.includes(p)) CURRENT_SNAPSHOT.member.circles.push(p);
  return clone(CURRENT_SNAPSHOT);
}

export async function joinCircle(): Promise<Snapshot> {
  await delay(300);
  const extra = "Joined Circle";
  if (!CURRENT_SNAPSHOT.member.circles.includes(extra)) CURRENT_SNAPSHOT.member.circles.push(extra);
  return clone(CURRENT_SNAPSHOT);
}

export async function reserveSession(): Promise<Snapshot> {
  await delay(350);
  const s = CURRENT_SNAPSHOT.sessions.find((x) => typeof x.slotsLeft === "number" && x.slotsLeft > 0);
  if (s) {
    s.slotsLeft = Math.max(0, (s.slotsLeft || 1) - 1);
    CURRENT_SNAPSHOT.stats.sessionsThisYear += 1;
    CURRENT_SNAPSHOT.stats.points += 100;
    updateLevelProgress(CURRENT_SNAPSHOT);
  }
  return clone(CURRENT_SNAPSHOT);
}

export async function reserveCircleInvitation(): Promise<Snapshot> {
  await delay(250);
  CURRENT_SNAPSHOT.stats.points += 50;
  updateLevelProgress(CURRENT_SNAPSHOT);
  return clone(CURRENT_SNAPSHOT);
}

export async function reactToMessage(messageId?: string, emoji: string = "👍"): Promise<Snapshot> {
  await delay(200);
  const circle = findCircleFirstKey();
  if (!circle) return clone(CURRENT_SNAPSHOT);
  const msgs = CURRENT_SNAPSHOT.circleChatByCircle[circle];
  const m = messageId ? msgs.find((msg) => msg.id === messageId) : msgs[0];
  if (m) {
    m.reactions = m.reactions || [];
    const existing = m.reactions.find((r) => r.emoji === emoji);
    if (existing) {
      existing.count = existing.count + 1;
      existing.reactedByMe = true;
    } else {
      m.reactions.push({ emoji, count: 1, reactedByMe: true });
    }
  }
  return clone(CURRENT_SNAPSHOT);
}

export async function addReferral(): Promise<Snapshot> {
  await delay(300);
  CURRENT_SNAPSHOT.stats.referrals += 1;
  CURRENT_SNAPSHOT.stats.points += 150;
  updateLevelProgress(CURRENT_SNAPSHOT);
  return clone(CURRENT_SNAPSHOT);
}

export async function submitCheckIn(): Promise<Snapshot> {
  await delay(450);
  CURRENT_SNAPSHOT.stats.completedStudies += 1;
  CURRENT_SNAPSHOT.stats.activeStreak += 1;
  CURRENT_SNAPSHOT.stats.bestStreak = Math.max(CURRENT_SNAPSHOT.stats.bestStreak || 0, CURRENT_SNAPSHOT.stats.activeStreak);
  CURRENT_SNAPSHOT.stats.points += 100;
  const newEntry = { id: `study-${Date.now()}`, title: `Estudio demo ${Date.now()}`, category: "Demo", date: new Date().toLocaleDateString(), contribution: "Check-in demo" } as any;
  CURRENT_SNAPSHOT.passportEntries.unshift(newEntry);
  awardBadgeIfNeeded(CURRENT_SNAPSHOT);
  updateLevelProgress(CURRENT_SNAPSHOT);
  return clone(CURRENT_SNAPSHOT);
}

export async function completeChallenge(): Promise<Snapshot> {
  await delay(350);
  if (CURRENT_SNAPSHOT.challenges && CURRENT_SNAPSHOT.challenges.length) {
    CURRENT_SNAPSHOT.challenges[0].progress = Math.min(CURRENT_SNAPSHOT.challenges[0].target, (CURRENT_SNAPSHOT.challenges[0].progress || 0) + 1);
    if (CURRENT_SNAPSHOT.challenges[0].progress >= CURRENT_SNAPSHOT.challenges[0].target) CURRENT_SNAPSHOT.challenges[0].completed = true;
    CURRENT_SNAPSHOT.stats.points += 50;
  }
  awardBadgeIfNeeded(CURRENT_SNAPSHOT);
  updateLevelProgress(CURRENT_SNAPSHOT);
  return clone(CURRENT_SNAPSHOT);
}

export async function redeemReward(): Promise<{ snapshot: Snapshot; reward: Reward; code: string }> {
  await delay(400);
  const reward = CURRENT_SNAPSHOT.rewards[0];
  const code = `DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  if (reward && CURRENT_SNAPSHOT.stats.points >= reward.costPoints) {
    CURRENT_SNAPSHOT.stats.points -= reward.costPoints;
    const redeemed: RedeemedReward = { rewardId: reward.id, redeemedAt: new Date().toISOString(), code };
    CURRENT_SNAPSHOT.redeemedRewards.push(redeemed);
    updateLevelProgress(CURRENT_SNAPSHOT);
    return { snapshot: clone(CURRENT_SNAPSHOT), reward, code };
  }
  return { snapshot: clone(CURRENT_SNAPSHOT), reward, code } as any;
}

export async function updateProfile(): Promise<Snapshot> {
  await delay(300);
  return clone(CURRENT_SNAPSHOT);
}

export async function adminLogin(input: AdminLoginInput): Promise<{ ok: boolean; token: string }> {
  return request<{ ok: boolean; token: string }>("/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function adminLogout(): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>("/admin/logout", { method: "POST" });
}

export async function getAdminOverview(): Promise<AdminOverview> {
  return request<AdminOverview>("/admin/overview", {
    headers: { Authorization: getAdminAuthHeader() },
  });
}

export async function adminCreateCircle(): Promise<CircleDefinition> {
  await delay(300);
  const c: CircleDefinition = { name: "Nuevo Círculo", description: "Creado demo", funFacts: [], limit: 100, memberCount: 0 };
  return c;
}

export async function adminCreateCircleInvitation(): Promise<{ ok: boolean }> {
  await delay(300);
  return { ok: true };
}

export async function adminGetCircleChat(): Promise<{ messages: ChatMessage[] }> {
  await delay(300);
  const circle = findCircleFirstKey();
  return { messages: CURRENT_SNAPSHOT.circleChatByCircle[circle] || [] };
}

export async function adminPostAnnouncement(): Promise<ChatMessage> {
  await delay(300);
  const msg: ChatMessage = { id: `ann-${Date.now()}`, authorName: "Admin", authorInitials: "AD", text: "Demo announcement", timestamp: new Date().toISOString(), fromMember: false, reactions: [] };
  const circle = findCircleFirstKey();
  CURRENT_SNAPSHOT.circleChatByCircle[circle].unshift(msg);
  return msg;
}

export async function adminDeleteChatMessage(): Promise<{ ok: boolean }> {
  await delay(200);
  const circle = findCircleFirstKey();
  if (CURRENT_SNAPSHOT.circleChatByCircle[circle].length) CURRENT_SNAPSHOT.circleChatByCircle[circle].shift();
  return { ok: true };
}

const API_BASE = "/api";
function getAdminAuthHeader(): string {
  const token = localStorage.getItem("adminToken");
  return token ? `Bearer ${token}` : "";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, init);
  const data = await response.json().catch(() => null) as (T & { message?: string }) | null;

  if (!response.ok) {
    const message = data?.message || "No se pudo completar la solicitud.";
    if (response.status === 401) throw new UnauthorizedError(message);
    throw new Error(message);
  }

  return data as T;
}
