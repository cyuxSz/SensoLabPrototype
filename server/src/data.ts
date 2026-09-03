import { getRedis } from "../../shared/redis.js";
import {
  getAccount,
  setAccount,
  getAllAccounts,
  getCircleCatalog,
  addCircleToCatalog,
  getGlobalSessions,
  updateGlobalSession,
  getGlobalRewards,
  updateGlobalReward,
  getCircleChat,
  setCircleChat,
  addCircleChatMessage,
  deleteCircleChatMessage,
  toggleCircleChatReaction,
  getCircleInvitations,
  updateCircleInvitation,
  buildSnapshot,
  CircleCatalogEntry,
  AccountState,
  Session,
  Reward,
  CircleSuggestion,
  PassportEntry,
  Badge,
  CommunityChallenge,
  Member,
  Stats,
  SensoryProfile,
} from "../../shared/data-access.js";
import type {
  AdminAccountSummary,
  AdminLoginInput,
  AdminOverview,
  Badge as BadgeType,
  ChatMessage,
  CircleDefinition,
  CircleInvitation,
  CircleSuggestion as CircleSuggestionType,
  CommunityChallenge as CommunityChallengeType,
  LoginInput,
  Member as MemberType,
  NewCircleInput,
  NewCircleInvitationInput,
  PassportEntry as PassportEntryType,
  ProfileUpdate,
  ReactionSummary,
  RedeemedReward,
  Reward as RewardType,
  Session as SessionType,
  SignupInput,
  Snapshot,
  Stats as StatsType,
} from "../../shared/types.js";

const LEVELS = ["Explorador", "Catador", "Curador", "Conocedor"];

const POINTS_PER_STUDY = 100;
const POINTS_PER_BADGE = 200;

function streakBonusFor(streak: number): number {
  let bonus = 0;
  if (streak % 3 === 0) bonus += 50;
  if (streak % 5 === 0) bonus += 75;
  if (streak % 10 === 0) bonus += 100;
  return bonus;
}

function freshBadges(): BadgeType[] {
  return [
    { id: "explorer", name: "Explorador", description: "Completa tu primer estudio sensorial.", earned: false },
    { id: "taster", name: "Catador", description: "Regresa para tres estudios o sesiones grupales.", earned: false },
    { id: "curator", name: "Curador", description: "Ayuda a dar forma a un concepto o da la bienvenida a un nuevo miembro.", earned: false },
    { id: "streaker", name: "Rachero", description: "Alcanza una racha de 5 estudios seguidos.", earned: false },
    { id: "year-completionist", name: "Asistencia Perfecta", description: "Participa en todos los estudios programados para tu círculo en el año.", earned: false },
  ];
}

function freshChallenges(): CommunityChallengeType[] {
  return [
    {
      id: "challenge-streak",
      title: "Racha de 3 estudios seguidos",
      description: "Participa en tres estudios o sesiones consecutivas sin perder tu racha.",
      metric: "streak",
      progress: 0,
      target: 3,
      reward: "Acceso prioritario a tu próxima invitación",
      completed: false,
    },
    {
      id: "challenge-year",
      title: "Asiste a todos los estudios del año",
      description: "Participa en cada estudio programado para tu círculo durante el año.",
      metric: "sessionsThisYear",
      progress: 0,
      target: 6,
      reward: "Muestra de producto exclusiva + insignia de fin de año",
      completed: false,
    },
    {
      id: "challenge-referrals",
      title: "Refiere a 5 personas",
      description: "Invita a 5 personas nuevas y elegibles a unirse a SensoLab.",
      metric: "referrals",
      progress: 0,
      target: 5,
      reward: "Bono de referido + lugar garantizado en una sesión exclusiva",
      completed: false,
    },
    {
      id: "challenge-circle-notes",
      title: "Haz lo invisible describible",
      description: "Agrega una nota sensorial al círculo este mes para construir vocabulario compartido.",
      metric: "circleNotes",
      progress: 0,
      target: 25,
      reward: "Reconocimiento como Curador del círculo",
      completed: false,
    },
  ];
}

function freshAccountState(password: string): AccountState {
  return {
    password,
    member: {
      name: "",
      birthDate: "",
      city: "",
      bio: "",
      joinedDate: new Date().toISOString().slice(0, 10),
      level: "Explorador",
      levelProgress: 0,
      nextLevelAt: 5,
      circles: [],
      interests: [],
      notifyByEmail: true,
      notifyByWhatsapp: false,
      sensoryProfile: {
        categories: [],
        dietary: [],
        spiceSensitivity: 3,
        sessionFormatPref: "either",
        frequencyPref: "monthly",
      },
      density: "comfortable",
    },
    stats: {
      completedStudies: 0,
      activeStreak: 0,
      bestStreak: 0,
      referrals: 0,
      unlockedBenefits: 0,
      sessionsThisYear: 0,
      totalSessionsScheduledThisYear: 6,
      lastCheckIn: null,
      points: 0,
    },
    passportEntries: [],
    badges: freshBadges(),
    challenges: freshChallenges(),
    pendingCircle: null,
    redeemedRewards: [],
  };
}

const seedSessions: Session[] = [
  {
    id: "session-004",
    title: "Laboratorio de Textura y Sabor",
    category: "Concepto alimenticio",
    date: "12 sep 2026",
    time: "10:30 AM",
    duration: "45 minutos",
    format: "Grupo pequeño",
    slotsLeft: 4,
    incentive: "Detalles compartidos antes de confirmar",
    status: "open",
  },
  {
    id: "session-005",
    title: "Estudio de Aroma y Rutina",
    category: "Cuidado personal",
    date: "19 sep 2026",
    time: "12:00 PM",
    duration: "35 minutos",
    format: "Sesión individual",
    slotsLeft: 7,
    incentive: "Detalles compartidos antes de confirmar",
    status: "open",
  },
  {
    id: "session-006",
    title: "Descubrimiento Grupal de Producto",
    category: "Sesión comunitaria",
    date: "03 oct 2026",
    time: "11:00 AM",
    duration: "60 minutos",
    format: "Evento de círculo",
    slotsLeft: 12,
    incentive: "Reconocimiento y recompensas aprobadas",
    status: "open",
  },
];

const seedRewards: Reward[] = [
  {
    id: "reward-priority",
    title: "Acceso prioritario a tu próxima sesión",
    description: "Salta al frente de la fila de confirmación en la siguiente invitación que reserves.",
    partnerName: "SensoLab Solutions",
    discountLabel: "Prioridad de reserva",
    costPoints: 300,
    icon: "zap",
    remaining: 999,
  },
  {
    id: "reward-sample",
    title: "Muestra de producto sorpresa",
    description: "Una muestra de un producto en evaluación, aprobada para entrega a participantes.",
    partnerName: "SensoLab Solutions",
    discountLabel: "Producto de cortesía",
    costPoints: 500,
    icon: "gift",
    remaining: 999,
  },
  {
    id: "reward-cafe",
    title: "20% de descuento en tu próxima compra",
    description: "Válido en toda la tienda en línea de nuestro aliado de café de especialidad.",
    partnerName: "Café Nuez",
    discountLabel: "20% de descuento",
    costPoints: 700,
    icon: "percent",
    remaining: 40,
  },
  {
    id: "reward-empresax",
    title: "50% de descuento en toda la página",
    description: "Convenio especial con Empresa X: la mitad de precio en cualquier producto de su catálogo en línea.",
    partnerName: "Empresa X",
    discountLabel: "50% de descuento",
    costPoints: 1200,
    icon: "sparkles",
    remaining: 25,
  },
  {
    id: "reward-kit",
    title: "Kit de bienvenida físico SensoLab",
    description: "Una caja con artículos de marca y una guía impresa de cómo se hace un estudio sensorial.",
    partnerName: "SensoLab Solutions",
    discountLabel: "Kit físico",
    costPoints: 1500,
    icon: "package",
    remaining: 999,
  },
  {
    id: "reward-1on1",
    title: "Sesión 1:1 con el equipo de investigación",
    description: "Media hora para conocer de primera mano cómo se usan tus contribuciones en el desarrollo de producto.",
    partnerName: "SensoLab Solutions",
    discountLabel: "Acceso exclusivo",
    costPoints: 2500,
    icon: "star",
    remaining: 999,
  },
];

const seedCircleCatalog = new Map<string, CircleCatalogEntry>([
  [
    "Catadores Veganos",
    {
      description: "Un grupo para quienes disfrutan comparar productos plant-based, texturas y sabores vegetales.",
      limit: 150,
      funFacts: [
        "El 'umami' vegetal se puede reforzar con hongos, miso o levadura nutricional, sin ingredientes de origen animal.",
        "La textura fibrosa de la carne se imita combinando proteína de soya o guisante con metilcelulosa, que actúa como aglutinante al calentarse.",
        "Muchos sabores 'a queso' plant-based usan ácido láctico y grasas de coco para imitar la cremosidad y el toque ácido del queso tradicional.",
        "El color rosado de algunas hamburguesas vegetales viene de la leghemoglobina de soya, la misma familia de moléculas que da color a la carne real.",
        "La leche de avena espuma mejor que otras leches vegetales porque sus betaglucanos (fibra soluble) atrapan aire de forma similar a las proteínas lácteas.",
      ],
    },
  ],
  [
    "Círculo de Fragancias y Cuidado",
    {
      description: "Un grupo enfocado en fragancias, cuidado personal y cosmética sensorial.",
      limit: 150,
      funFacts: [
        "El olfato humano puede distinguir más de un billón de combinaciones distintas de aromas, según estudios de Rockefeller University.",
        "Las 'notas de salida, corazón y fondo' de un perfume se evaporan a distintas velocidades según el peso molecular de cada ingrediente.",
        "La sensación de 'frescura' en un shampoo suele venir de mentol o eucaliptol, que activan receptores de frío en la piel, no de temperatura real.",
        "El aroma de 'limpio' en muchos productos es en realidad una combinación sintética diseñada para evocar esa percepción, no un olor natural único.",
      ],
    },
  ],
  [
    "Descubridores Cotidianos",
    {
      description: "Un grupo general para quienes quieren descubrir de todo un poco en estudios sensoriales.",
      limit: 150,
      funFacts: [
        "El panel sensorial humano puede distinguir miles de combinaciones de aroma, sabor y textura mucho más rápido que un sensor electrónico.",
        "La percepción del sabor depende hasta en un 80% del olfato, no solo de las papilas gustativas.",
        "El color de un empaque puede cambiar la percepción de dulzor o frescura de un producto, incluso sin cambiar la fórmula.",
      ],
    },
  ],
]);

const seedCircleChat = [
  {
    id: "chat-001",
    authorName: "SensoLab",
    authorInitials: "SL",
    text: "📢 Recordatorio: sesión de Laboratorio de Textura y Sabor el 12 de septiembre. ¡Últimos lugares disponibles!",
    timestamp: "2026-08-20T15:04:00.000Z",
    fromMember: false,
    reactions: [],
  },
  {
    id: "chat-002",
    authorName: "SensoLab",
    authorInitials: "SL",
    text: "🎉 ¡Bienvenidos los nuevos miembros de esta semana! Qué gusto tenerlos en Catadores Veganos.",
    timestamp: "2026-08-20T15:07:00.000Z",
    fromMember: false,
    reactions: [],
  },
  {
    id: "chat-003",
    authorName: "SensoLab",
    authorInitials: "SL",
    text: "💬 Cuéntanos con una reacción: ¿les gustaría que evaluáramos más quesos vegetales próximamente?",
    timestamp: "2026-08-20T15:09:00.000Z",
    fromMember: false,
    reactions: [],
  },
];

const seedCircleInvitations = [
  {
    id: "circle-invite-001",
    circleName: "Catadores Veganos",
    title: "Formulación vegana: nueva línea de quesos",
    description:
      "SensoLab busca específicamente a integrantes de Catadores Veganos para evaluar tres prototipos de queso vegano antes de su lanzamiento.",
    category: "Solo para tu círculo",
    spotsNeeded: 12,
    spotsFilled: 7,
    incentive: "Pago mayor al estándar + producto de cortesía",
    status: "open" as const,
  },
];

// ============ PURE FUNCTIONS USING SHARED DATA-ACCESS ============

export async function getSnapshot(email: string): Promise<Snapshot> {
  const redis = getRedis();
  return buildSnapshot(redis, email);
}

export async function isAuthenticated(email: string): Promise<boolean> {
  const redis = getRedis();
  const account = await getAccount(redis, email);
  return account !== null;
}

export async function login(input: LoginInput): Promise<Snapshot | null> {
  const redis = getRedis();
  const email = input.email.trim().toLowerCase();
  const account = await getAccount(redis, email);
  if (account && account.password === input.password) {
    return buildSnapshot(redis, email);
  }
  return null;
}

export async function logout(email: string): Promise<void> {
  // No-op for stateless; client clears token
}

export async function suggestCircle(input: Pick<SignupInput, "categories" | "dietary">): Promise<CircleSuggestionType> {
  let name = "Descubridores Cotidianos";
  let matchReason = "Te sugerimos un círculo general porque tus respuestas cubren varios intereses distintos.";

  const dietary = input.dietary.map((item) => item.toLowerCase());
  const categories = input.categories.map((item) => item.toLowerCase());

  if (dietary.some((item) => item.includes("vegan") || item.includes("vegetarian"))) {
    name = "Catadores Veganos";
    matchReason = "Te sugerimos este círculo porque marcaste una dieta vegetariana o vegana.";
  } else if (categories.some((item) => item.includes("cosmét") || item.includes("cuidado personal"))) {
    name = "Círculo de Fragancias y Cuidado";
    matchReason = "Te sugerimos este círculo porque te interesan los cosméticos y el cuidado personal.";
  } else if (categories.some((item) => item.includes("aliment") || item.includes("bebida"))) {
    name = "Catadores Veganos";
    matchReason = "Te sugerimos este círculo porque te interesan los alimentos y bebidas.";
  }

  const redis = getRedis();
  const catalog = await getCircleCatalog(redis);
  const entry = catalog.get(name);
  const funFacts = entry?.funFacts.slice(0, 3) ?? [];
  const description = entry?.description ?? "";
  return { name, description, matchReason, funFacts };
}

export type SignupResult =
  | { ok: true; snapshot: Snapshot; suggestion: CircleSuggestionType }
  | { ok: false; message: string };

export async function signup(input: SignupInput): Promise<SignupResult> {
  const redis = getRedis();
  const email = input.email.trim().toLowerCase();
  const existing = await getAccount(redis, email);
  if (existing) {
    return { ok: false, message: "Ya existe una cuenta con ese correo. Inicia sesión en su lugar." };
  }

  const state = freshAccountState(input.password);
  state.member.name = input.name.trim().slice(0, 60);
  state.member.birthDate = input.birthDate;
  state.member.city = input.city.trim().slice(0, 60);
  state.member.interests = [...input.categories];
  state.member.sensoryProfile = {
    categories: [...input.categories],
    dietary: [...input.dietary],
    spiceSensitivity: input.spiceSensitivity,
    sessionFormatPref: input.sessionFormatPref,
    frequencyPref: input.frequencyPref,
  };

  const suggestion = await suggestCircle(input);
  state.pendingCircle = suggestion;

  await setAccount(redis, email, state);

  return { ok: true, snapshot: await buildSnapshot(redis, email), suggestion };
}

export async function getPendingCircle(email: string): Promise<CircleSuggestionType | null> {
  const redis = getRedis();
  const account = await getAccount(redis, email);
  return account?.pendingCircle ?? null;
}

function unlockBadge(account: AccountState, id: string) {
  const badge = account.badges.find((candidate) => candidate.id === id);
  if (badge && !badge.earned) {
    badge.earned = true;
    account.stats.points += POINTS_PER_BADGE;
  }
}

function finalizeCircleJoin(account: AccountState, name: string) {
  if (!account.member.circles.includes(name)) {
    account.member.circles.push(name);
  }
  unlockBadge(account, "explorer");
  account.stats.unlockedBenefits = Math.min(6, account.stats.unlockedBenefits + 1);
}

function syncChallenges(account: AccountState) {
  for (const challenge of account.challenges) {
    if (challenge.metric === "streak") {
      challenge.progress = Math.min(account.stats.activeStreak, challenge.target);
      challenge.completed = account.stats.activeStreak >= challenge.target;
    } else if (challenge.metric === "sessionsThisYear") {
      challenge.progress = Math.min(account.stats.sessionsThisYear, challenge.target);
      challenge.completed = account.stats.sessionsThisYear >= challenge.target;
      if (challenge.completed) unlockBadge(account, "year-completionist");
    } else if (challenge.metric === "referrals") {
      challenge.progress = Math.min(account.stats.referrals, challenge.target);
      challenge.completed = account.stats.referrals >= challenge.target;
    }
  }
}

function advanceLevelIfNeeded(account: AccountState) {
  if (account.member.levelProgress >= account.member.nextLevelAt) {
    const currentIndex = LEVELS.indexOf(account.member.level);
    const nextIndex = Math.min(currentIndex + 1, LEVELS.length - 1);
    if (nextIndex !== currentIndex) {
      account.member.level = LEVELS[nextIndex];
      account.member.levelProgress = 0;
      account.member.nextLevelAt += 2;
      unlockBadge(account, "curator");
    } else {
      account.member.levelProgress = account.member.nextLevelAt;
    }
  }
}

export async function joinPendingCircle(email: string): Promise<Snapshot | null> {
  const redis = getRedis();
  const account = await getAccount(redis, email);
  if (!account || !account.pendingCircle) return null;

  finalizeCircleJoin(account, account.pendingCircle.name);
  account.pendingCircle = null;

  await setAccount(redis, email, account);
  return buildSnapshot(redis, email);
}

export async function joinCircleByName(email: string, name: string): Promise<Snapshot | null> {
  const redis = getRedis();
  const account = await getAccount(redis, email);
  if (!account) return null;
  const catalog = await getCircleCatalog(redis);
  if (!catalog.has(name)) return null;
  if (account.member.circles.includes(name)) return buildSnapshot(redis, email);

  const entry = catalog.get(name);
  if (entry) {
    const memberCount = 0; // Will be computed in buildSnapshot
    // Check limit
    if (memberCount >= entry.limit) {
      return null;
    }
  }

  finalizeCircleJoin(account, name);
  await setAccount(redis, email, account);
  return buildSnapshot(redis, email);
}

export async function reserveSession(email: string, sessionId: string): Promise<Snapshot | null> {
  const redis = getRedis();
  const account = await getAccount(redis, email);
  if (!account) return null;
  const sessions = await getGlobalSessions(redis);
  const session = sessions.find((candidate) => candidate.id === sessionId);
  if (!session) return null;

  if (session.status === "open") {
    await updateGlobalSession(redis, sessionId, { status: "reserved", slotsLeft: Math.max(0, session.slotsLeft - 1) });
  }

  return buildSnapshot(redis, email);
}

export async function reserveCircleInvitation(email: string, circleName: string, invitationId: string): Promise<Snapshot | null> {
  const redis = getRedis();
  const account = await getAccount(redis, email);
  if (!account || !account.member.circles.includes(circleName)) return null;

  const invitation = (await getCircleInvitations(redis, circleName)).find((c) => c.id === invitationId);
  if (!invitation) return null;

  if (invitation.status === "open") {
    await updateCircleInvitation(redis, circleName, invitationId, { status: "reserved", spotsFilled: Math.min(invitation.spotsNeeded, invitation.spotsFilled + 1) });
  }

  return buildSnapshot(redis, email);
}

export async function toggleReaction(email: string, circleName: string, messageId: string, emoji: string): Promise<Snapshot | null> {
  const redis = getRedis();
  const account = await getAccount(redis, email);
  if (!account || !account.member.circles.includes(circleName)) return null;

  await toggleCircleChatReaction(redis, circleName, messageId, email, emoji);
  return buildSnapshot(redis, email);
}

export async function addReferral(email: string): Promise<Snapshot | null> {
  const redis = getRedis();
  const account = await getAccount(redis, email);
  if (!account) return null;
  account.stats.referrals += 1;
  syncChallenges(account);
  await setAccount(redis, email, account);
  return buildSnapshot(redis, email);
}

export async function recordCheckIn(email: string): Promise<Snapshot | null> {
  const redis = getRedis();
  const account = await getAccount(redis, email);
  if (!account) return null;

  const now = new Date();
  const entryId = `study-${Date.now()}`;

  account.passportEntries.unshift({
    id: entryId,
    title: "Check-in del Pasaporte Sensorial",
    category: "Estudio demo",
    date: now.toLocaleDateString("es-MX", { month: "short", day: "2-digit", year: "numeric" }),
    contribution: "Tu check-in post-sesión mantiene visible tu historial de participación y ayuda a SensoLab a entender tu comportamiento de retorno.",
  });

  account.stats.completedStudies += 1;
  account.stats.activeStreak += 1;
  account.stats.bestStreak = Math.max(account.stats.bestStreak, account.stats.activeStreak);
  account.stats.sessionsThisYear = Math.min(account.stats.totalSessionsScheduledThisYear, account.stats.sessionsThisYear + 1);
  account.stats.unlockedBenefits = Math.min(6, account.stats.unlockedBenefits + 1);
  account.stats.lastCheckIn = now.toISOString();

  account.stats.points += POINTS_PER_STUDY;
  account.stats.points += streakBonusFor(account.stats.activeStreak);

  account.member.levelProgress += 1;
  advanceLevelIfNeeded(account);

  if (account.stats.completedStudies >= 1) unlockBadge(account, "explorer");
  if (account.stats.completedStudies >= 3) unlockBadge(account, "taster");
  if (account.stats.activeStreak >= 5) unlockBadge(account, "streaker");

  syncChallenges(account);

  await setAccount(redis, email, account);
  return buildSnapshot(redis, email);
}

export async function completeChallengeById(email: string, challengeId: string): Promise<Snapshot | null> {
  const redis = getRedis();
  const account = await getAccount(redis, email);
  if (!account) return null;
  const challenge = account.challenges.find((candidate) => candidate.id === challengeId);
  if (!challenge) return null;

  if (challenge.metric === "circleNotes" && !challenge.completed) {
    challenge.completed = true;
    challenge.progress = challenge.target;
    account.stats.unlockedBenefits = Math.min(6, account.stats.unlockedBenefits + 1);
    unlockBadge(account, "curator");
  }

  await setAccount(redis, email, account);
  return buildSnapshot(redis, email);
}

export async function updateProfile(email: string, update: ProfileUpdate): Promise<Snapshot | null> {
  const redis = getRedis();
  const account = await getAccount(redis, email);
  if (!account) return null;

  if (typeof update.name === "string" && update.name.trim().length > 0) {
    account.member.name = update.name.trim().slice(0, 60);
  }
  if (typeof update.city === "string" && update.city.trim().length > 0) {
    account.member.city = update.city.trim().slice(0, 60);
  }
  if (typeof update.bio === "string") {
    account.member.bio = update.bio.trim().slice(0, 220);
  }
  if (Array.isArray(update.interests)) {
    account.member.interests = update.interests
      .map((interest) => interest.trim())
      .filter((interest) => interest.length > 0)
      .slice(0, 8);
  }
  if (typeof update.notifyByEmail === "boolean") {
    account.member.notifyByEmail = update.notifyByEmail;
  }
  if (typeof update.notifyByWhatsapp === "boolean") {
    account.member.notifyByWhatsapp = update.notifyByWhatsapp;
  }
  if (update.density === "comfortable" || update.density === "compact") {
    account.member.density = update.density;
  }

  await setAccount(redis, email, account);
  return buildSnapshot(redis, email);
}

export type RedeemResult =
  | { ok: true; snapshot: Snapshot; reward: RewardType; code: string }
  | { ok: false; message: string };

function generateRedemptionCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "SL-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function redeemReward(email: string, rewardId: string): Promise<RedeemResult> {
  const redis = getRedis();
  const account = await getAccount(redis, email);
  if (!account) return { ok: false, message: "Inicia sesión para continuar." };

  const rewards = await getGlobalRewards(redis);
  const reward = rewards.find((candidate) => candidate.id === rewardId);
  if (!reward) return { ok: false, message: "Esa recompensa no existe." };

  if (account.redeemedRewards.some((redemption) => redemption.rewardId === rewardId)) {
    return { ok: false, message: "Ya canjeaste esta recompensa." };
  }
  if (reward.remaining <= 0) {
    return { ok: false, message: "Esta recompensa ya no tiene cupos disponibles." };
  }
  if (account.stats.points < reward.costPoints) {
    return { ok: false, message: "No tienes suficientes puntos para esta recompensa." };
  }

  account.stats.points -= reward.costPoints;
  await updateGlobalReward(redis, rewardId, { remaining: reward.remaining - 1 });
  const code = generateRedemptionCode();
  account.redeemedRewards.push({ rewardId, redeemedAt: new Date().toISOString(), code });

  await setAccount(redis, email, account);
  return { ok: true, snapshot: await buildSnapshot(redis, email), reward: { ...reward }, code };
}

// ---- Admin operations ----

export async function isAdminAuthenticated(): Promise<boolean> {
  const redis = getRedis();
  const token = await redis.get<string>("admin:session");
  return token === "admin";
}

export async function adminLogin(input: AdminLoginInput): Promise<boolean> {
  if (input.email.trim().toLowerCase() === "admin@sensolab.mx" && input.password === "admin2026") {
    const redis = getRedis();
    await redis.set("admin:session", "admin", { ex: 24 * 60 * 60 });
    return true;
  }
  return false;
}

export async function adminLogout(): Promise<void> {
  const redis = getRedis();
  await redis.del("admin:session");
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const redis = getRedis();
  const catalog = await getCircleCatalog(redis);
  const allAccounts = await getAllAccounts(redis);

  const circles = Array.from(catalog.keys())
    .map((name) => {
      const entry = catalog.get(name);
      if (!entry) return null;
      const memberCount = allAccounts.filter((a) => a.member.circles.includes(name)).length;
      return { name, description: entry.description, funFacts: entry.funFacts, limit: entry.limit, memberCount };
    })
    .filter((c): c is CircleDefinition => c !== null);

  const accountSummaries: AdminAccountSummary[] = allAccounts.map((account) => ({
    email: "", // email not stored in account, would need to track separately
    name: account.member.name || "(sin nombre)",
    city: account.member.city,
    circles: account.member.circles,
    level: account.member.level,
    completedStudies: account.stats.completedStudies,
    referrals: account.stats.referrals,
  }));

  return { circles, accounts: accountSummaries };
}

export type CreateCircleResult = { ok: true; circle: CircleDefinition } | { ok: false; message: string };

export async function createCircle(input: NewCircleInput): Promise<CreateCircleResult> {
  const redis = getRedis();
  const name = input.name.trim();
  if (name.length === 0) {
    return { ok: false, message: "El círculo necesita un nombre." };
  }
  const catalog = await getCircleCatalog(redis);
  if (catalog.has(name)) {
    return { ok: false, message: "Ya existe un círculo con ese nombre." };
  }

  await addCircleToCatalog(redis, name, {
    description: input.description.trim(),
    funFacts: input.funFacts.map((fact) => fact.trim()).filter((fact) => fact.length > 0),
    limit: input.limit,
  });

  // Initialize empty chat and invitations
  await redis.set(`global:circleChat:${name}`, []);
  await redis.set(`global:invitations:${name}`, []);

  const entry = catalog.get(name)!;
  const memberCount = 0; // New circle has no members yet
  return { ok: true, circle: { name, description: entry.description, funFacts: entry.funFacts, limit: entry.limit, memberCount } };
}

export type CreateInvitationResult = { ok: true; invitation: CircleInvitation } | { ok: false; message: string };

export async function createCircleInvitation(circleName: string, input: NewCircleInvitationInput): Promise<CreateInvitationResult> {
  const redis = getRedis();
  const catalog = await getCircleCatalog(redis);
  if (!catalog.has(circleName)) {
    return { ok: false, message: "Ese círculo no existe." };
  }

  const invitation: CircleInvitation = {
    id: `circle-invite-${Date.now()}`,
    circleName,
    title: input.title.trim(),
    description: input.description.trim(),
    category: "Solo para tu círculo",
    spotsNeeded: input.spotsNeeded,
    spotsFilled: 0,
    incentive: input.incentive.trim(),
    status: "open",
  };

  const list = await getCircleInvitations(redis, circleName);
  list.push(invitation);
  await redis.set(`global:invitations:${circleName}`, list);

  return { ok: true, invitation };
}

export async function getCircleChatForAdmin(circleName: string): Promise<ChatMessage[]> {
  const redis = getRedis();
  const messages = await getCircleChat(redis, circleName);
  return messages.map((msg) => ({
    id: msg.id,
    authorName: msg.authorName,
    authorInitials: msg.authorInitials,
    text: msg.text,
    timestamp: msg.timestamp,
    fromMember: msg.fromMember,
    reactions: msg.reactions
      .filter((r) => r.emails.length > 0)
      .map((r) => ({ emoji: r.emoji, count: r.emails.length, reactedByMe: false })),
  }));
}

export type PostAnnouncementResult = { ok: true; message: ChatMessage } | { ok: false; message2: string };

export async function postAnnouncementAsAdmin(circleName: string, text: string): Promise<PostAnnouncementResult> {
  const redis = getRedis();
  const catalog = await getCircleCatalog(redis);
  if (!catalog.has(circleName)) {
    return { ok: false, message2: "Ese círculo no existe." };
  }

  const stored = {
    id: `chat-${Date.now()}`,
    authorName: "SensoLab",
    authorInitials: "SL",
    text: text.trim().slice(0, 500),
    timestamp: new Date().toISOString(),
    fromMember: false,
    reactions: [],
  };

  await addCircleChatMessage(redis, circleName, stored);

  return { ok: true, message: { ...stored, reactions: [] } };
}

export async function deleteChatMessageAsAdmin(circleName: string, messageId: string): Promise<boolean> {
  const redis = getRedis();
  return deleteCircleChatMessage(redis, circleName, messageId);
}

// ============ INITIALIZATION (called on server start) ============

export async function initializeData(): Promise<void> {
  const redis = getRedis();
  
  // Initialize global sessions if not exists
  const existingSessions = await getGlobalSessions(redis);
  if (existingSessions.length === 0) {
    await redis.set("global:sessions", seedSessions);
  }
  
  // Initialize global rewards if not exists
  const existingRewards = await getGlobalRewards(redis);
  if (existingRewards.length === 0) {
    await redis.set("global:rewards", seedRewards);
  }
  
  // Initialize circle catalog if not exists
  const catalog = await getCircleCatalog(redis);
  if (catalog.size === 0) {
    await redis.set("global:circleCatalog", Object.fromEntries(seedCircleCatalog));
  }
  
  // Initialize circle chat if not exists
  for (const [name, messages] of Object.entries({
    "Catadores Veganos": seedCircleChat,
    "Círculo de Fragancias y Cuidado": [],
    "Descubridores Cotidianos": [],
  })) {
    const existing = await getCircleChat(redis, name);
    if (existing.length === 0 && messages.length > 0) {
      await setCircleChat(redis, name, messages);
    }
  }
  
  // Initialize circle invitations if not exists
  for (const [name, invitations] of Object.entries({
    "Catadores Veganos": seedCircleInvitations,
    "Círculo de Fragancias y Cuidado": [],
    "Descubridores Cotidianos": [],
  })) {
    const existing = await getCircleInvitations(redis, name);
    if (existing.length === 0 && invitations.length > 0) {
      await redis.set(`global:invitations:${name}`, invitations);
    }
  }
  
  // Initialize admin session
  const adminSession = await redis.get<string>("admin:session");
  if (!adminSession) {
    await redis.set("admin:session", "admin", { ex: 24 * 60 * 60 });
  }
}