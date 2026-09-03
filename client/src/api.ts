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

const API_BASE = "/api";

function getAuthHeader(): string | undefined {
  const token = localStorage.getItem("authToken");
  return token ? `Bearer ${token}` : undefined;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(getAuthHeader() ? { Authorization: getAuthHeader() } : {}),
      ...init?.headers,
    },
    credentials: "include",
    ...init,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    if (response.status === 401) {
      throw new UnauthorizedError(payload?.message ?? "Inicia sesión para continuar.");
    }
    throw new Error(payload?.message ?? "The demo API could not complete the request.");
  }

  return response.json() as Promise<T>;
}

export function getSnapshot(): Promise<Snapshot> {
  return request<Snapshot>("/dashboard");
}

export function login(input: LoginInput): Promise<{ snapshot: Snapshot; token: string }> {
  return request<{ snapshot: Snapshot; token: string }>("/auth/login", { method: "POST", body: JSON.stringify(input) });
}

export function logout(): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>("/auth/logout", { method: "POST" });
}

export function signup(input: SignupInput): Promise<{ snapshot: Snapshot; suggestion: CircleSuggestion; token: string }> {
  return request<{ snapshot: Snapshot; suggestion: CircleSuggestion; token: string }>("/auth/signup", { method: "POST", body: JSON.stringify(input) });
}

export function previewCircleSuggestion(input: { categories: string[]; dietary: string[] }): Promise<CircleSuggestion> {
  return request<CircleSuggestion>("/onboarding/suggest-circle", { method: "POST", body: JSON.stringify(input) });
}

export function joinPendingCircle(): Promise<Snapshot> {
  return request<Snapshot>("/onboarding/join-circle", { method: "POST" });
}

export function joinCircle(circleName: string): Promise<Snapshot> {
  return request<Snapshot>(`/circles/${encodeURIComponent(circleName)}/join`, { method: "POST" });
}

export function reserveSession(sessionId: string): Promise<Snapshot> {
  return request<Snapshot>(`/sessions/${sessionId}/rsvp`, { method: "POST" });
}

export function reserveCircleInvitation(circleName: string, invitationId: string): Promise<Snapshot> {
  return request<Snapshot>(`/circles/${encodeURIComponent(circleName)}/invitations/${invitationId}/rsvp`, { method: "POST" });
}

export function reactToMessage(circleName: string, messageId: string, emoji: string): Promise<Snapshot> {
  return request<Snapshot>(`/circles/${encodeURIComponent(circleName)}/chat/${messageId}/react`, { method: "POST", body: JSON.stringify({ emoji }) });
}

export function addReferral(): Promise<Snapshot> {
  return request<Snapshot>("/referrals", { method: "POST" });
}

export function submitCheckIn(code: string): Promise<Snapshot> {
  return request<Snapshot>("/check-ins", { method: "POST", body: JSON.stringify({ code }) });
}

export function completeChallenge(challengeId: string): Promise<Snapshot> {
  return request<Snapshot>(`/challenges/${challengeId}/complete`, { method: "POST" });
}

export function redeemReward(rewardId: string): Promise<{ snapshot: Snapshot; reward: import("./types").Reward; code: string }> {
  return request<{ snapshot: Snapshot; reward: import("./types").Reward; code: string }>(`/rewards/${rewardId}/redeem`, { method: "POST" });
}

export function updateProfile(update: ProfileUpdate): Promise<Snapshot> {
  return request<Snapshot>("/profile", { method: "PATCH", body: JSON.stringify(update) });
}

export function adminLogin(input: AdminLoginInput): Promise<{ ok: boolean; token: string }> {
  return request<{ ok: boolean; token: string }>("/admin/login", { method: "POST", body: JSON.stringify(input) });
}

export function adminLogout(): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>("/admin/logout", { method: "POST" });
}

export function getAdminOverview(): Promise<AdminOverview> {
  return request<AdminOverview>("/admin/overview");
}

export function adminCreateCircle(input: NewCircleInput): Promise<CircleDefinition> {
  return request<CircleDefinition>("/admin/circles", { method: "POST", body: JSON.stringify(input) });
}

export function adminCreateCircleInvitation(circleName: string, input: NewCircleInvitationInput) {
  return request(`/admin/circles/${encodeURIComponent(circleName)}/invitations`, { method: "POST", body: JSON.stringify(input) });
}

export function adminGetCircleChat(circleName: string) {
  return request<{ messages: import("./types").ChatMessage[] }>(`/admin/circles/${encodeURIComponent(circleName)}/chat`);
}

export function adminPostAnnouncement(circleName: string, text: string) {
  return request<import("./types").ChatMessage>(`/admin/circles/${encodeURIComponent(circleName)}/chat`, { method: "POST", body: JSON.stringify({ text }) });
}

export function adminDeleteChatMessage(circleName: string, messageId: string) {
  return request<{ ok: boolean }>(`/admin/circles/${encodeURIComponent(circleName)}/chat/${messageId}`, { method: "DELETE" });
}