export const keys = {
  user: {
    account: (email: string) => `user:${email.toLowerCase()}:account`,
    session: (email: string) => `user:${email.toLowerCase()}:session`,
  },
  global: {
    circleCatalog: "global:circleCatalog",
    circleChat: (circleName: string) => `global:circleChat:${circleName}`,
    circleInvitations: (circleName: string) => `global:invitations:${circleName}`,
    rewards: "global:rewards",
    sessions: "global:sessions",
  },
  admin: {
    session: "admin:session",
  },
} as const;

export type UserAccountKey = ReturnType<typeof keys.user.account>;
export type UserSessionKey = ReturnType<typeof keys.user.session>;
export type GlobalCircleCatalogKey = typeof keys.global.circleCatalog;
export type GlobalCircleChatKey = ReturnType<typeof keys.global.circleChat>;
export type GlobalCircleInvitationsKey = ReturnType<typeof keys.global.circleInvitations>;
export type GlobalRewardsKey = typeof keys.global.rewards;
export type GlobalSessionsKey = typeof keys.global.sessions;
export type AdminSessionKey = typeof keys.admin.session;