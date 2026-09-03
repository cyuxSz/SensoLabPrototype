import { config } from "dotenv";
config({ path: ".env" });

import { getRedis } from "../shared/redis";
import {
  getAccount,
  setAccount,
  setCircleCatalog,
  setGlobalSessions,
  setGlobalRewards,
  setCircleChat,
  setCircleInvitations,
  setAdminSession,
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
} from "../shared/data-access";

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

function freshBadges(): Badge[] {
  return [
    { id: "explorer", name: "Explorador", description: "Completa tu primer estudio sensorial.", earned: false },
    { id: "taster", name: "Catador", description: "Regresa para tres estudios o sesiones grupales.", earned: false },
    { id: "curator", name: "Curador", description: "Ayuda a dar forma a un concepto o da la bienvenida a un nuevo miembro.", earned: false },
    { id: "streaker", name: "Rachero", description: "Alcanza una racha de 5 estudios seguidos.", earned: false },
    { id: "year-completionist", name: "Asistencia Perfecta", description: "Participa en todos los estudios programados para tu círculo en el año.", earned: false },
  ];
}

function freshChallenges(): CommunityChallenge[] {
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

function seedAccountState(password: string): AccountState {
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

function demoAlexAccount(): AccountState {
  const state = seedAccountState("senso2026");
  state.member = {
    ...state.member,
    name: "Alex M.",
    birthDate: "1998-04-12",
    city: "Monterrey",
    bio: "Me gusta descubrir sabores y texturas nuevas antes que nadie.",
    joinedDate: "2026-06-05",
    level: "Catador",
    levelProgress: 3,
    nextLevelAt: 5,
    circles: ["Catadores Veganos"],
    interests: ["Alimentos", "Sesiones grupales"],
    sensoryProfile: {
      categories: ["Alimentos", "Bebidas"],
      dietary: ["Vegetariana"],
      spiceSensitivity: 3,
      sessionFormatPref: "group",
      frequencyPref: "monthly",
    },
  };
  state.stats = {
    completedStudies: 3,
    activeStreak: 2,
    bestStreak: 4,
    referrals: 1,
    unlockedBenefits: 2,
    sessionsThisYear: 3,
    totalSessionsScheduledThisYear: 6,
    lastCheckIn: null,
    points: 700,
  };
  state.passportEntries = [
    {
      id: "study-003",
      title: "Estudio de Textura Cítrica",
      category: "Concepto alimenticio",
      date: "08 ago 2026",
      contribution: "Tu grupo ayudó al equipo a entender qué textura se sentía más fresca y fácil de disfrutar.",
    },
    {
      id: "study-002",
      title: "Comparación de Snacks Plant-Based",
      category: "Concepto alimenticio",
      date: "17 jul 2026",
      contribution: "La sesión comparó aroma, crujido y regusto entre distintas direcciones tempranas de producto.",
    },
    {
      id: "study-001",
      title: "Descubrimiento de Producto Cotidiano",
      category: "Sesión comunitaria",
      date: "05 jun 2026",
      contribution: "Tu primera visita creó una base para los intereses que se muestran en tu perfil de miembro.",
    },
  ];
  state.badges = freshBadges();
  state.badges[0].earned = true;
  state.badges[1].earned = true;
  state.challenges = freshChallenges();
  state.challenges[0].progress = 2;
  state.challenges[1].progress = 3;
  state.challenges[2].progress = 1;
  state.challenges[3].progress = 18;
  return state;
}

function emptyMariaAccount(): AccountState {
  return seedAccountState("demo123");
}

const circleCatalog = new Map<string, CircleCatalogEntry>([
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

const sessions: Session[] = [
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

const rewards: Reward[] = [
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

const circleChat = [
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

const circleInvitations = [
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

async function main() {
  console.log("🌱 Iniciando seed de Redis...\n");

  try {
    // Test connection
    const redisClient = getRedis();
    const pong = await redisClient.ping();
    console.log(`✅ Redis conectado: ${pong}\n`);

    // 1. Seed accounts
    console.log("👤 Poblando cuentas de usuario...");
    await setAccount(redisClient, "alex@demo.com", demoAlexAccount());
    console.log("   ✓ alex@demo.com (password: senso2026) - cuenta demo con progreso");
    
    await setAccount(redisClient, "maria@demo.com", emptyMariaAccount());
    console.log("   ✓ maria@demo.com (password: demo123) - cuenta vacía para onboarding\n");

    // 2. Seed global catalog
    console.log("📚 Poblando catálogo global de círculos...");
    await setCircleCatalog(redisClient, circleCatalog);
    console.log(`   ✓ ${circleCatalog.size} círculos: Catadores Veganos, Círculo de Fragancias y Cuidado, Descubridores Cotidianos\n`);

    // 3. Seed global sessions
    console.log("📅 Poblando sesiones globales...");
    await setGlobalSessions(redisClient, sessions);
    console.log(`   ✓ ${sessions.length} sesiones\n`);

    // 4. Seed global rewards
    console.log("🎁 Poblando recompensas globales...");
    await setGlobalRewards(redisClient, rewards);
    console.log(`   ✓ ${rewards.length} recompensas\n`);

    // 5. Seed circle chat
    console.log("💬 Poblando chat de círculos...");
    await setCircleChat(redisClient, "Catadores Veganos", circleChat);
    await setCircleChat(redisClient, "Círculo de Fragancias y Cuidado", []);
    await setCircleChat(redisClient, "Descubridores Cotidianos", []);
    console.log("   ✓ Chat inicial para Catadores Veganos\n");

    // 6. Seed circle invitations
    console.log("📨 Poblando invitaciones de círculos...");
    await setCircleInvitations(redisClient, "Catadores Veganos", circleInvitations);
    await setCircleInvitations(redisClient, "Círculo de Fragancias y Cuidado", []);
    await setCircleInvitations(redisClient, "Descubridores Cotidianos", []);
    console.log("   ✓ Invitación para Catadores Veganos\n");

    // 7. Admin session
    console.log("🔐 Configurando sesión admin...");
    await setAdminSession(redisClient, "admin");
    console.log("   ✓ Token admin configurado\n");

    console.log("🎉 Seed completado exitosamente!");
    console.log("\n📋 Credenciales de prueba:");
    console.log("   Usuario demo: alex@demo.com / senso2026");
    console.log("   Usuario nuevo: maria@demo.com / demo123");
    console.log("   Admin: admin@sensolab.mx / admin2026");

  } catch (error) {
    console.error("❌ Error durante seed:", error);
    process.exit(1);
  }
}

main();