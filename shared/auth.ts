export interface AuthResult {
  email: string;
  isAdmin: boolean;
}

export function parseAuthToken(authHeader: string | null): AuthResult | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  if (token.startsWith("demo-")) return { email: token.slice(5), isAdmin: false };
  if (token === "admin") return { email: "admin@sensolab.mx", isAdmin: true };
  return null;
}

export function requireAuth(authHeader: string | null): { email: string } {
  const auth = parseAuthToken(authHeader);
  if (!auth || auth.isAdmin) throw new Error("Unauthorized");
  return { email: auth.email };
}

export function requireAdminAuth(authHeader: string | null): void {
  const auth = parseAuthToken(authHeader);
  if (!auth || !auth.isAdmin) throw new Error("Admin unauthorized");
}

export function createDemoToken(email: string): string {
  return `demo-${email.toLowerCase()}`;
}

export function createAdminToken(): string {
  return "admin";
}

export const DEMO_CREDENTIALS = {
  "alex@demo.com": "senso2026",
  "maria@demo.com": "demo123",
  "admin@sensolab.mx": "admin2026",
} as const;