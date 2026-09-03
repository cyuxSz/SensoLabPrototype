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

export interface CircleDefinition {
  name: string;
  description: string;
  funFacts: string[];
  limit: number;
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
  activeStreak: number;
  bestStreak: number;
  referrals: number;
  unlockedBenefits: number;
  sessionsThisYear: number;
  totalSessionsScheduledThisYear: number;
  lastCheckIn: string | null;
  points: number;
}

export interface ReactionSummary {
  emoji: string;
  count: number;
  reactedByMe: boolean;
}

export const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "🙌"] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];

export interface ChatMessage {
  id: string;
  authorName: string;
  authorInitials: string;
  text: string;
  timestamp: string;
  fromMember: boolean;
  reactions: ReactionSummary[];
}

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
  myCircles: CircleDefinition[];
  circleChatByCircle: Record<string, ChatMessage[]>;
  circleInvitationsByCircle: Record<string, CircleInvitation[]>;
  discoverableCircles: CircleDefinition[];
  rewards: Reward[];
  redeemedRewards: RedeemedReward[];
}

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

export interface StoredReaction {
  emoji: string;
  emails: string[];
}

export interface StoredChatMessage {
  id: string;
  authorName: string;
  authorInitials: string;
  text: string;
  timestamp: string;
  fromMember: boolean;
  reactions: StoredReaction[];
}

export interface CircleCatalogEntry {
  description: string;
  funFacts: string[];
  limit: number;
}

export interface AccountState {
  password: string;
  member: Member;
  stats: Stats;
  passportEntries: PassportEntry[];
  badges: Badge[];
  challenges: CommunityChallenge[];
  pendingCircle: CircleSuggestion | null;
  redeemedRewards: RedeemedReward[];
}