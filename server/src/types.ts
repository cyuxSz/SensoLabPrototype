export type SessionStatus = "open" | "reserved";

export interface SensoryProfile {
  categories: string[];
  dietary: string[];
  spiceSensitivity: number;
  sessionFormatPref: "individual" | "group" | "either";
  frequencyPref: "weekly" | "monthly" | "occasional";
}

export interface Member {
  name: string;
  birthDate: string;
  city: string;
  bio: string;
  joinedDate: string;
  level: string;
  levelProgress: number;
  nextLevelAt: number;
  /** A member can belong to more than one circle at once. */
  circles: string[];
  interests: string[];
  notifyByEmail: boolean;
  notifyByWhatsapp: boolean;
  sensoryProfile: SensoryProfile;
  density: "comfortable" | "compact";
}

export interface ProfileUpdate {
  name?: string;
  city?: string;
  bio?: string;
  interests?: string[];
  notifyByEmail?: boolean;
  notifyByWhatsapp?: boolean;
  density?: Member["density"];
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  name: string;
  birthDate: string;
  city: string;
  email: string;
  password: string;
  categories: string[];
  dietary: string[];
  spiceSensitivity: number;
  sessionFormatPref: SensoryProfile["sessionFormatPref"];
  frequencyPref: SensoryProfile["frequencyPref"];
}

export interface CircleSuggestion {
  name: string;
  description: string;
  matchReason: string;
  funFacts: string[];
}

/** A circle as it exists in the shared catalog — the same shape whether it
 * was seeded at startup or created later by a SensoLab admin. */
export interface CircleDefinition {
  name: string;
  description: string;
  funFacts: string[];
  limit: number;
  /** Computed on read from how many accounts have joined — never stored. */
  memberCount: number;
}

export interface NewCircleInput {
  name: string;
  description: string;
  funFacts: string[];
  limit: number;
}

export interface PassportEntry {
  id: string;
  title: string;
  category: string;
  date: string;
  contribution: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
}

export interface Session {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  duration: string;
  format: string;
  slotsLeft: number;
  incentive: string;
  status: SessionStatus;
}

/**
 * Community challenges are deliberately non-competitive (per Activity 3
 * findings: the public Top 5 ranking was NOT a strong motivator; tiered,
 * concrete rewards were). Each one tracks personal progress toward a
 * simple, general goal — never a leaderboard.
 */
export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  metric: "streak" | "referrals" | "sessionsThisYear" | "circleNotes";
  progress: number;
  target: number;
  reward: string;
  completed: boolean;
}

export interface Stats {
  completedStudies: number;
  /** Consecutive studies attended in a row (NOT calendar days). */
  activeStreak: number;
  bestStreak: number;
  referrals: number;
  unlockedBenefits: number;
  sessionsThisYear: number;
  totalSessionsScheduledThisYear: number;
  lastCheckIn: string | null;
  /** Redeemable points: +100 per study, +200 per badge, plus streak
   * milestone bonuses (see awardStreakBonus in data.ts). */
  points: number;
}

export interface ReactionSummary {
  emoji: string;
  count: number;
  reactedByMe: boolean;
}

/**
 * The circle "chat" is a one-way announcement channel (WhatsApp Channel
 * style): only SensoLab staff can post messages; members can only react.
 */
export interface ChatMessage {
  id: string;
  authorName: string;
  authorInitials: string;
  text: string;
  timestamp: string;
  fromMember: boolean;
  reactions: ReactionSummary[];
}

export const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "🙌"] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];

/** A study invitation scoped to one specific circle, separate from the
 * general (non-circle) sessions list. */
export interface CircleInvitation {
  id: string;
  circleName: string;
  title: string;
  description: string;
  category: string;
  spotsNeeded: number;
  spotsFilled: number;
  incentive: string;
  status: SessionStatus;
}

export interface NewCircleInvitationInput {
  title: string;
  description: string;
  spotsNeeded: number;
  incentive: string;
}

/** A partner reward redeemable with points — same shape whether it's a
 * built-in seed reward or one added later. */
export interface Reward {
  id: string;
  title: string;
  description: string;
  partnerName: string;
  discountLabel: string;
  costPoints: number;
  icon: string;
  remaining: number;
}

export interface RedeemedReward {
  rewardId: string;
  redeemedAt: string;
  code: string;
}

export interface Snapshot {
  member: Member;
  stats: Stats;
  passportEntries: PassportEntry[];
  badges: Badge[];
  sessions: Session[];
  challenges: CommunityChallenge[];
  /** All circles the member has joined, each with its own chat, fun facts,
   * and invitations. */
  myCircles: CircleDefinition[];
  circleChatByCircle: Record<string, ChatMessage[]>;
  circleInvitationsByCircle: Record<string, CircleInvitation[]>;
  /** Circles the member has NOT joined yet, to browse and join. */
  discoverableCircles: CircleDefinition[];
  rewards: Reward[];
  redeemedRewards: RedeemedReward[];
}

// ---- Admin (SensoLab staff) ----

export interface AdminLoginInput {
  email: string;
  password: string;
}

export interface AdminAccountSummary {
  email: string;
  name: string;
  city: string;
  circles: string[];
  level: string;
  completedStudies: number;
  referrals: number;
}

export interface AdminOverview {
  circles: CircleDefinition[];
  accounts: AdminAccountSummary[];
}

export interface NewAnnouncementInput {
  text: string;
}
