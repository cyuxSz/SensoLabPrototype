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

// Mock data for demo
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
    { id: "study-003", title: "Estudio de Textura Cítrica", category: "Concepto alimenticio", date: "08 ago 2026", contribution: "Tu grupo ayudó al equipo a entender qué textura se sentía más fresca y fácil de disfrutar." },
    { id: "study-002", title: "Comparación de Snacks Plant-Based", category: "Concepto alimenticio", date: "17 jul 2026", contribution: "La sesión comparó aroma, crujido y regusto entre distintas direcciones tempranas de producto." },
    { id: "study-001", title: "Descubrimiento de Producto Cotidiano", category: "Sesión comunitaria", date: "05 jun 2026", contribution: "Tu primera visita creó una base para los intereses que se muestran en tu perfil de miembro." },
  ],
  badges: [
    { id: "explorer", name: "Explorador", description: "Completa tu primer estudio sensorial.", earned: true },
    { id: "taster", name: "Catador", description: "Regresa para tres estudios o sesiones grupales.", earned: true },
    { id: "curator", name: "Curador", description: "Ayuda a dar forma a un concepto o da la bienvenida a un nuevo miembro.", earned: false },
    { id: "streaker", name: "Rachero", description: "Alcanza una racha de 5 estudios seguidos.", earned: false },
    { id: "year-completionist", name: "Asistencia Perfecta", description: "Participa en todos los estudios programados para tu círculo en el año.", earned: false },
  ],
  sessions: [
    { id: "session-004", title: "Laboratorio de Textura y Sabor", category: "Concepto alimenticio", date: "12 sep 2026", time: "10:30 AM", duration: "45 minutos", format: "Grupo pequeño", slotsLeft: 4, incentive: "Detalles compartidos antes de confirmar", status: "open" },
    { id: "session-005", title: "Estudio de Aroma y Rutina", category: "Cuidado personal", date: "19 sep 2026", time: "12:00 PM", duration: "35 minutos", format: "Sesión individual", slotsLeft: 7, incentive: "Detalles compartidos antes de confirmar", status: "open" },
    { id: "session-006", title: "Descubrimiento Grupal de Producto", category: "Sesión comunitaria", date: "03 oct 2026", time: "11:00 AM", duration: "60 minutos", format: "Evento de círculo", slotsLeft: 12, incentive: "Reconocimiento y recompensas aprobadas", status: "open" },
  ],
  challenges: [
    { id: "challenge-streak", title: "Racha de 3 estudios seguidos", description: "Participa en tres estudios o sesiones consecutivas sin perder tu racha.", metric: "streak", progress: 2, target: 3, reward: "Acceso prioritario a tu próxima invitación", completed: false },
    { id: "challenge-year", title: "Asiste a todos los estudios del año", description: "Participa en cada estudio programado para tu círculo durante el año.", metric: "sessionsThisYear", progress: 3, target: 6, reward: "Muestra de producto exclusiva + insignia de fin de año", completed: false },
    { id: "challenge-referrals", title: "Refiere a 5 personas", description: "Invita a 5 personas nuevas y elegibles a unirse a SensoLab.", metric: "referrals", progress: 1, target: 5, reward: "Bono de referido + lugar garantizado en una sesión exclusiva", completed: false },
    { id: "challenge-circle-notes", title: "Haz lo invisible describible", description: "Agrega una nota sensorial al círculo este mes para construir vocabulario compartido.", metric: "circleNotes", progress: 18, target: 25, reward: "Reconocimiento como Curador del círculo", completed: false },
  ],
  myCircles: [
    { name: "Catadores Veganos", description: "Un grupo para quienes disfrutan comparar productos plant-based, texturas y sabores vegetales.", funFacts: ["El 'umami' vegetal se puede reforzar con hongos, miso o levadura nutricional, sin ingredientes de origen animal."], limit: 150, memberCount: 42 },
  ],
  circleChatByCircle: {
    "Catadores Veganos": [
      { id: "chat-001", authorName: "SensoLab", authorInitials: "SL", text: "📢 Recordatorio: sesión de Laboratorio de Textura y Sabor el 12 de septiembre. ¡Últimos lugares disponibles!", timestamp: "2026-08-20T15:04:00.000Z", fromMember: false, reactions: [] },
      { id: "chat-002", authorName: "SensoLab", authorInitials: "SL", text: "🎉 ¡Bienvenidos los nuevos miembros de esta semana! Qué gusto tenerlos en Catadores Veganos.", timestamp: "2026-08-20T15:07:00.000Z", fromMember: false, reactions: [] },
    ],
  },
  circleInvitationsByCircle: {
    "Catadores Veganos": [
      { id: "circle-invite-001", circleName: "Catadores Veganos", title: "Formulación vegana: nueva línea de quesos", description: "SensoLab busca específicamente a integrantes de Catadores Veganos para evaluar tres prototipos de queso vegano antes de su lanzamiento.", category: "Solo para tu círculo", spotsNeeded: 12, spotsFilled: 7, incentive: "Pago mayor al estándar + producto de cortesía", status: "open" },
    ],
  },
  discoverableCircles: [
    { name: "Círculo de Fragancias y Cuidado", description: "Un grupo enfocado en fragancias, cuidado personal y cosmética sensorial.", funFacts: ["El olfato humano puede distinguir más de un billón de combinaciones distintas de aromas."], limit: 150, memberCount: 28 },
    { name: "Descubridores Cotidianos", description: "Un grupo general para quienes quieren descubrir de todo un poco en estudios sensoriales.", funFacts: ["El panel sensorial humano puede distinguir miles de combinaciones de aroma, sabor y textura."], limit: 150, memberCount: 67 },
  ],
  rewards: [
    { id: "reward-priority", title: "Acceso prioritario a tu próxima sesión", description: "Salta al frente de la fila de confirmación en la siguiente invitación que reserves.", partnerName: "SensoLab Solutions", discountLabel: "Prioridad de reserva", costPoints: 300, icon: "zap", remaining: 999 },
    { id: "reward-sample", title: "Muestra de producto sorpresa", description: "Una muestra de un producto en evaluación, aprobada para entrega a participantes.", partnerName: "SensoLab Solutions", discountLabel: "Producto de cortesía", costPoints: 500, icon: "gift", remaining: 999 },
    { id: "reward-cafe", title: "20% de descuento en tu próxima compra", description: "Válido en toda la tienda en línea de nuestro aliado de café de especialidad.", partnerName: "Café Nuez", discountLabel: "20% de descuento", costPoints: 700, icon: "percent", remaining: 40 },
    { id: "reward-empresax", title: "50% de descuento en toda la página", description: "Convenio especial con Empresa X: la mitad de precio en cualquier producto de su catálogo en línea.", partnerName: "Empresa X", discountLabel: "50% de descuento", costPoints: 1200, icon: "sparkles", remaining: 25 },
    { id: "reward-kit", title: "Kit de bienvenida físico SensoLab", description: "Una caja con artículos de marca y una guía impresa de cómo se hace un estudio sensorial.", partnerName: "SensoLab Solutions", discountLabel: "Kit físico", costPoints: 1500, icon: "package", remaining: 999 },
    { id: "reward-1on1", title: "Sesión 1:1 con el equipo de investigación", description: "Media hora para conocer de primera mano cómo se usan tus contribuciones en el desarrollo de producto.", partnerName: "SensoLab Solutions", discountLabel: "Acceso exclusivo", costPoints: 2500, icon: "star", remaining: 999 },
  ],
  redeemedRewards: [],
};

const MOCK_CIRCLE_SUGGESTION: CircleSuggestion = {
  name: "Catadores Veganos",
  description: "Un grupo para quienes disfrutan comparar productos plant-based, texturas y sabores vegetales.",
  matchReason: "Tu perfil coincide con el 87% de los miembros activos",
  funFacts: ["Catamos 20+ orígenes al año", "Sesiones con tostadores locales", "Acceso a micro-lotes exclusivos"],
};

const MOCK_ADMIN_OVERVIEW: AdminOverview = {
  circles: [
    { name: "Catadores Veganos", description: "Un grupo para quienes disfrutan comparar productos plant-based.", funFacts: [], limit: 150, memberCount: 42 },
    { name: "Círculo de Fragancias y Cuidado", description: "Un grupo enfocado en fragancias y cosmética sensorial.", funFacts: [], limit: 150, memberCount: 28 },
  ],
  accounts: [
    { email: "alex@demo.com", name: "Alex Demo", city: "Monterrey", circles: ["Catadores Veganos"], level: "Catador", completedStudies: 3, referrals: 1 },
    { email: "maria@demo.com", name: "María García", city: "CDMX", circles: ["Círculo de Fragancias y Cuidado"], level: "Iniciado", completedStudies: 1, referrals: 0 },
  ],
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock auth functions
export async function login(input: LoginInput): Promise<{ snapshot: Snapshot; token: string }> {
  await delay(500);
  if (!input.email || !input.password) {
    throw new UnauthorizedError("Ingresa correo y contraseña");
  }
  return { snapshot: MOCK_SNAPSHOT, token: `demo-${input.email}` };
}

export async function signup(input: SignupInput): Promise<{ snapshot: Snapshot; suggestion: CircleSuggestion; token: string }> {
  await delay(800);
  if (!input.email || !input.password || !input.name) {
    throw new UnauthorizedError("Completa todos los campos");
  }
  return { snapshot: MOCK_SNAPSHOT, suggestion: MOCK_CIRCLE_SUGGESTION, token: `demo-${input.email}` };
}

export async function logout(): Promise<{ ok: boolean }> {
  await delay(100);
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
  return MOCK_SNAPSHOT;
}

export async function getAdminOverview(): Promise<AdminOverview> {
  await delay(300);
  return MOCK_ADMIN_OVERVIEW;
}

export async function previewCircleSuggestion(): Promise<CircleSuggestion> {
  await delay(400);
  return MOCK_CIRCLE_SUGGESTION;
}

export async function joinPendingCircle(): Promise<Snapshot> {
  await delay(500);
  return MOCK_SNAPSHOT;
}

export async function joinCircle(): Promise<Snapshot> {
  await delay(300);
  return MOCK_SNAPSHOT;
}

export async function reserveSession(): Promise<Snapshot> {
  await delay(300);
  return MOCK_SNAPSHOT;
}

export async function reserveCircleInvitation(): Promise<Snapshot> {
  await delay(300);
  return MOCK_SNAPSHOT;
}

export async function reactToMessage(): Promise<Snapshot> {
  await delay(200);
  return MOCK_SNAPSHOT;
}

export async function addReferral(): Promise<Snapshot> {
  await delay(300);
  return MOCK_SNAPSHOT;
}

export async function submitCheckIn(): Promise<Snapshot> {
  await delay(500);
  return MOCK_SNAPSHOT;
}

export async function completeChallenge(): Promise<Snapshot> {
  await delay(300);
  return MOCK_SNAPSHOT;
}

export async function redeemReward(): Promise<{ snapshot: Snapshot; reward: import("./types").Reward; code: string }> {
  await delay(400);
  return { snapshot: MOCK_SNAPSHOT, reward: MOCK_SNAPSHOT.rewards[0], code: "DEMO-1234" };
}

export async function updateProfile(): Promise<Snapshot> {
  await delay(300);
  return MOCK_SNAPSHOT;
}

export async function adminCreateCircle(): Promise<CircleDefinition> {
  await delay(300);
  return MOCK_ADMIN_OVERVIEW.circles[0];
}

export async function adminCreateCircleInvitation(): Promise<{ ok: boolean }> {
  await delay(300);
  return { ok: true };
}

export async function adminGetCircleChat(): Promise<{ messages: import("./types").ChatMessage[] }> {
  await delay(300);
  return { messages: [] };
}

export async function adminPostAnnouncement(): Promise<import("./types").ChatMessage> {
  await delay(300);
  return { id: "new", authorName: "Admin", authorInitials: "AD", text: "Demo announcement", timestamp: new Date().toISOString(), fromMember: false, reactions: [] };
}

export async function adminDeleteChatMessage(): Promise<{ ok: boolean }> {
  await delay(200);
  return { ok: true };
}

// Unused but keep for type compatibility
const API_BASE = "/api";
function getAuthHeader(): string | undefined {
  const token = localStorage.getItem("authToken");
  return token ? `Bearer ${token}` : undefined;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  throw new Error(`API call not mocked: ${path}`);
}