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
} from "./types";

export class UnauthorizedError extends Error {}

// Helper: shallow-ish deep clone for in-memory mutation (serialize/deserialize)
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

// Mock data for demo (original snapshot)
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
    { id: "session-004", title: "Laboratorio de Textura y Sabor", category: "Concepto alimenticio", date: "12 sep 2026", time: "10:30 AM", duration: "45 minutos", format: "Grupo pequeño", slotsLeft: 3 },
    { id: "session-005", title: "Estudio de Aroma y Rutina", category: "Cuidado personal", date: "19 sep 2026", time: "12:00 PM", duration: "35 minutos", format: "Sesión individual", slotsLeft: 7 },
    { id: "session-006", title: "Descubrimiento Grupal de Producto", category: "Sesión comunitaria", date: "03 oct 2026", time: "11:00 AM", duration: "60 minutos", format: "Evento de círculo", slotsLeft: 10 },
  ],
  challenges: [
    { id: "challenge-streak", title: "Racha de 3 estudios seguidos", description: "Participa en tres estudios o sesiones consecutivas sin perder tu racha.", metric: "streak", progress: 2, target: 3, reward: "badge-streak-3" },
    { id: "challenge-year", title: "Asiste a todos los estudios del año", description: "Participa en cada estudio programado para tu círculo durante el año.", metric: "sessionsThisYear", progress: 3, target: 12, reward: "reward-year" },
    { id: "challenge-referrals", title: "Refiere a 5 personas", description: "Invita a 5 personas nuevas y elegibles a unirse a SensoLab.", metric: "referrals", progress: 1, target: 5, reward: "reward-referrals" },
    { id: "challenge-circle-notes", title: "Haz lo invisible describible", description: "Agrega una nota sensorial al círculo este mes para construir vocabulario compartido.", metric: "circleNotes", progress: 0, target: 1 },
  ],
  myCircles: [
    { name: "Catadores Veganos", description: "Un grupo para quienes disfrutan comparar productos plant-based, texturas y sabores vegetales.", funFacts: ["El 'umami' vegetal se puede reforzar con..."] },
  ],
  circleChatByCircle: {
    "Catadores Veganos": [
      { id: "chat-001", authorName: "SensoLab", authorInitials: "SL", text: "📢 Recordatorio: sesión de Laboratorio de Textura y Sabor el 12 de septiembre. ¡Últimos lugares disponibles!", timestamp: new Date().toISOString(), fromMember: false, reactions: {} },
      { id: "chat-002", authorName: "SensoLab", authorInitials: "SL", text: "🎉 ¡Bienvenidos los nuevos miembros de esta semana! Qué gusto tenerlos en Catadores Veganos.", timestamp: new Date().toISOString(), fromMember: false, reactions: {} },
    ],
  },
  circleInvitationsByCircle: {
    "Catadores Veganos": [
      { id: "circle-invite-001", circleName: "Catadores Veganos", title: "Formulación vegana: nueva línea de quesos", description: "SensoLab busca específicamente a integrantes de Catadores Veganos." },
    ],
  },
  discoverableCircles: [
    { name: "Círculo de Fragancias y Cuidado", description: "Un grupo enfocado en fragancias y cosmética sensorial.", funFacts: ["El olfato humano puede distinguir más de un... "] },
    { name: "Descubridores Cotidianos", description: "Un grupo general para quienes quieren descubrir de todo un poco en estudios sensoriales.", funFacts: ["El panel sensorial humano puede distinguir... "] },
  ],
  rewards: [
    { id: "reward-priority", title: "Acceso prioritario a tu próxima sesión", description: "Salta al frente de la fila de confirmación en la siguiente invitación que reserves." },
    { id: "reward-sample", title: "Muestra de producto sorpresa", description: "Una muestra de un producto en evaluación, aprobada para entrega a participantes." },
    { id: "reward-cafe", title: "20% de descuento en tu próxima compra", description: "Válido en toda la tienda en línea de nuestro aliado de café de especialidad." },
    { id: "reward-empresax", title: "50% de descuento en toda la página", description: "Convenio especial con Empresa X: la mitad de precio en cualquier producto de su catálogo en línea." },
    { id: "reward-kit", title: "Kit de bienvenida físico SensoLab", description: "Una caja con artículos de marca y una guía impresa de cómo se hace un estudio sensorial." },
    { id: "reward-1on1", title: "Sesión 1:1 con el equipo de investigación", description: "Media hora para conocer de primera mano cómo se usan tus contribuciones en el desarrollo de producto." },
  ],
  redeemedRewards: [],
};

// Mutable in-memory snapshot used for all mock operations during the session.
let CURRENT_SNAPSHOT: Snapshot = clone(MOCK_SNAPSHOT);

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helpers to mutate state
function awardBadgeIfNeeded(snapshot: Snapshot) {
  // Example: award 'streaker' at activeStreak >=3
  if (!snapshot.badges.find((b) => b.id === 'streaker')?.earned && snapshot.stats.activeStreak >= 3) {
    const badge = snapshot.badges.find((b) => b.id === 'streaker');
    if (badge) badge.earned = true as any;
  }
}

function updateLevelProgress(snapshot: Snapshot) {
  // simple rule: every 500 points gain a levelProgress point
  const points = snapshot.stats.points;
  const levelProgress = Math.min(snapshot.member.nextLevelAt, Math.floor((points % 1000) / 100));
  snapshot.member.levelProgress = levelProgress;
}

// Mock auth functions
export async function login(input: LoginInput): Promise<{ snapshot: Snapshot; token: string }> {
  await delay(500);
  if (!input.email || !input.password) {
    throw new UnauthorizedError("Ingresa correo y contraseña");
  }
  // Reset in-memory snapshot on fresh login to simulate per-session state
  CURRENT_SNAPSHOT = clone(MOCK_SNAPSHOT);
  return { snapshot: clone(CURRENT_SNAPSHOT), token: `demo-${input.email}` };
}

export async function signup(input: SignupInput): Promise<{ snapshot: Snapshot; suggestion: CircleSuggestion; token: string }> {
  await delay(800);
  if (!input.email || !input.password || !input.name) {
    throw new UnauthorizedError("Completa todos los campos");
  }
  CURRENT_SNAPSHOT = clone(MOCK_SNAPSHOT);
  // personalize
  CURRENT_SNAPSHOT.member.name = input.name;
  return { snapshot: clone(CURRENT_SNAPSHOT), suggestion: { name: 'Everyday Discoverers', description: 'Sugerencia simulada', matchReason: 'Mock rules', funFacts: ['Dato A'] }, token: `demo-${input.email}` };
}

export async function logout(): Promise<{ ok: boolean }> {
  await delay(100);
  CURRENT_SNAPSHOT = clone(MOCK_SNAPSHOT);
  return { ok: true };
}

export async function adminLogin(input: AdminLoginInput): Promise<{ ok: boolean; token: string }> {
  await delay(500);
  return { ok: true, token: "admin" };
}

export async function adminLogout(): Promise<{ ok: boolean }> {
  await delay(100);
  return { ok: true };
}

// Mock data functions
export async function getSnapshot(): Promise<Snapshot> {
  await delay(300);
  return clone(CURRENT_SNAPSHOT);
}

export async function getAdminOverview(): Promise<AdminOverview> {
  await delay(300);
  return { circles: [], accounts: [] } as AdminOverview;
}

export async function previewCircleSuggestion(): Promise<CircleSuggestion> {
  await delay(400);
  return { name: "Catadores Veganos", description: "Mock suggestion", matchReason: "Rules", funFacts: ["X"] };
}

export async function joinPendingCircle(): Promise<Snapshot> {
  await delay(500);
  // simulate joining a pending circle: add to member.circles
  const pending = "New Circle";
  if (!CURRENT_SNAPSHOT.member.circles.includes(pending)) CURRENT_SNAPSHOT.member.circles.push(pending);
  return clone(CURRENT_SNAPSHOT);
}

export async function joinCircle(): Promise<Snapshot> {
  await delay(300);
  const extra = "Joined Circle";
  if (!CURRENT_SNAPSHOT.member.circles.includes(extra)) CURRENT_SNAPSHOT.member.circles.push(extra);
  return clone(CURRENT_SNAPSHOT);
}

export async function reserveSession(): Promise<Snapshot> {
  await delay(300);
  // find first session with slotsLeft > 0 and decrement
  const s = CURRENT_SNAPSHOT.sessions.find((x: any) => typeof x.slotsLeft === 'number' && x.slotsLeft > 0);
  if (s) {
    s.slotsLeft = Math.max(0, s.slotsLeft - 1);
    // also increment a reserved count or sessionsThisYear
    CURRENT_SNAPSHOT.stats.sessionsThisYear += 1;
    CURRENT_SNAPSHOT.stats.points += 100; // reward points for reservation
  }
  return clone(CURRENT_SNAPSHOT);
}

export async function reserveCircleInvitation(): Promise<Snapshot> {
  await delay(300);
  // simulate accepting an invitation
  CURRENT_SNAPSHOT.stats.points += 50;
  return clone(CURRENT_SNAPSHOT);
}

export async function reactToMessage(messageId?: string): Promise<Snapshot> {
  await delay(200);
  // toggle a reaction on the first message in first circle
  const circle = Object.keys(CURRENT_SNAPSHOT.circleChatByCircle)[0];
  const msgs = CURRENT_SNAPSHOT.circleChatByCircle[circle];
  if (msgs && msgs.length) {
    const m = msgs[0];
    m.reactions = m.reactions || {};
    m.reactions['👍'] = (m.reactions['👍'] || 0) + 1;
  }
  return clone(CURRENT_SNAPSHOT);
}

export async function addReferral(): Promise<Snapshot> {
  await delay(300);
  CURRENT_SNAPSHOT.stats.referrals += 1;
  CURRENT_SNAPSHOT.stats.points += 150;
  return clone(CURRENT_SNAPSHOT);
}

export async function submitCheckIn(): Promise<Snapshot> {
  await delay(500);
  // simulate check-in: increment counters, update streak, possibly award badge
  CURRENT_SNAPSHOT.stats.completedStudies += 1;
  CURRENT_SNAPSHOT.stats.activeStreak += 1;
  CURRENT_SNAPSHOT.stats.bestStreak = Math.max(CURRENT_SNAPSHOT.stats.bestStreak || 0, CURRENT_SNAPSHOT.stats.activeStreak);
  CURRENT_SNAPSHOT.stats.points += 100;
  // add passport entry
  const newEntry = { id: `study-${Date.now()}`, title: `Estudio ${Date.now()}`, category: 'Demo', date: new Date().toLocaleDateString(), contribution: 'Check-in demo' } as any;
  CURRENT_SNAPSHOT.passportEntries.unshift(newEntry);
  awardBadgeIfNeeded(CURRENT_SNAPSHOT);
  updateLevelProgress(CURRENT_SNAPSHOT);
  return clone(CURRENT_SNAPSHOT);
}

export async function completeChallenge(): Promise<Snapshot> {
  await delay(300);
  // mark first challenge progress
  if (CURRENT_SNAPSHOT.challenges && CURRENT_SNAPSHOT.challenges.length) {
    CURRENT_SNAPSHOT.challenges[0].progress = Math.min(CURRENT_SNAPSHOT.challenges[0].target, (CURRENT_SNAPSHOT.challenges[0].progress || 0) + 1);
    CURRENT_SNAPSHOT.stats.points += 50;
  }
  awardBadgeIfNeeded(CURRENT_SNAPSHOT);
  return clone(CURRENT_SNAPSHOT);
}

export async function redeemReward(): Promise<{ snapshot: Snapshot; reward: import("./types").Reward; code: string }> {
  await delay(400);
  // take the first reward if points are enough
  const reward = CURRENT_SNAPSHOT.rewards[0];
  if (reward && CURRENT_SNAPSHOT.stats.points >= 300) {
    CURRENT_SNAPSHOT.stats.points -= 300;
    CURRENT_SNAPSHOT.redeemedRewards.push(reward.id || reward.title);
    updateLevelProgress(CURRENT_SNAPSHOT);
    return { snapshot: clone(CURRENT_SNAPSHOT), reward, code: `DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}` };
  }
  // not enough points — still return snapshot but no deduct
  return { snapshot: clone(CURRENT_SNAPSHOT), reward, code: `DEMO-NA` } as any;
}

export async function updateProfile(): Promise<Snapshot> {
  await delay(300);
  // for demo we simply return current snapshot
  return clone(CURRENT_SNAPSHOT);
}

export async function adminCreateCircle(): Promise<CircleDefinition> {
  await delay(300);
  const c = { name: 'Nuevo Círculo', description: 'Creado demo', funFacts: [], limit: 100, memberCount: 0 } as any;
  return c;
}

export async function adminCreateCircleInvitation(): Promise<{ ok: boolean }> {
  await delay(300);
  return { ok: true };
}

export async function adminGetCircleChat(): Promise<{ messages: import("./types").ChatMessage[] }> {
  await delay(300);
  const circle = Object.keys(CURRENT_SNAPSHOT.circleChatByCircle)[0];
  return { messages: CURRENT_SNAPSHOT.circleChatByCircle[circle] || [] };
}

export async function adminPostAnnouncement(): Promise<import("./types").ChatMessage> {
  await delay(300);
  const msg = { id: `ann-${Date.now()}`, authorName: 'Admin', authorInitials: 'AD', text: 'Demo announcement', timestamp: new Date().toISOString(), fromMember: false, reactions: {} } as any;
  const circle = Object.keys(CURRENT_SNAPSHOT.circleChatByCircle)[0];
  CURRENT_SNAPSHOT.circleChatByCircle[circle].unshift(msg);
  return msg;
}

export async function adminDeleteChatMessage(): Promise<{ ok: boolean }> {
  await delay(200);
  const circle = Object.keys(CURRENT_SNAPSHOT.circleChatByCircle)[0];
  if (CURRENT_SNAPSHOT.circleChatByCircle[circle].length) CURRENT_SNAPSHOT.circleChatByCircle[circle].shift();
  return { ok: true };
}

// Unused but keep for type compatibility
const API_BASE = "/api";
function getAuthHeader(): string | undefined {
  const token = localStorage.getItem("authToken");
  return token ? `Bearer ${token}` : undefined;
}

async function request<T>(_path: string, _init?: RequestInit): Promise<T> {
  throw new Error(`API call not mocked: ${_path}`);
}
