import { keys } from "./redis-keys";
// ============ ACCOUNT OPERATIONS ============
export async function getAccount(redis, email) {
    const data = await redis.get(keys.user.account(email));
    return data ?? null;
}
export async function setAccount(redis, email, account) {
    await redis.set(keys.user.account(email), account);
}
export async function getAllAccounts(redis) {
    const keys_list = await redis.keys("user:*:account");
    if (keys_list.length === 0)
        return [];
    const pipeline = redis.pipeline();
    keys_list.forEach((k) => pipeline.get(k));
    const results = await pipeline.exec();
    return results.map((r) => r).filter(Boolean);
}
export async function deleteAccount(redis, email) {
    await redis.del(keys.user.account(email), keys.user.session(email));
}
// ============ SESSION OPERATIONS ============
export async function setUserSession(redis, email, data) {
    await redis.set(keys.user.session(email), data, { ex: 30 * 24 * 60 * 60 }); // 30 days
}
export async function getUserSession(redis, email) {
    return (await redis.get(keys.user.session(email))) ?? null;
}
export async function clearUserSession(redis, email) {
    await redis.del(keys.user.session(email));
}
// ============ GLOBAL CATALOG OPERATIONS ============
export async function getCircleCatalog(redis) {
    const data = await redis.get(keys.global.circleCatalog);
    return new Map(Object.entries(data ?? {}));
}
export async function setCircleCatalog(redis, catalog) {
    const obj = Object.fromEntries(catalog);
    await redis.set(keys.global.circleCatalog, obj);
}
export async function addCircleToCatalog(redis, name, entry) {
    const catalog = await getCircleCatalog(redis);
    catalog.set(name, entry);
    await setCircleCatalog(redis, catalog);
}
export async function getGlobalSessions(redis) {
    return (await redis.get(keys.global.sessions)) ?? [];
}
export async function setGlobalSessions(redis, sessions) {
    await redis.set(keys.global.sessions, sessions);
}
export async function updateGlobalSession(redis, sessionId, updates) {
    const sessions = await getGlobalSessions(redis);
    const idx = sessions.findIndex((s) => s.id === sessionId);
    if (idx === -1)
        return null;
    sessions[idx] = { ...sessions[idx], ...updates };
    await setGlobalSessions(redis, sessions);
    return sessions[idx];
}
export async function getGlobalRewards(redis) {
    return (await redis.get(keys.global.rewards)) ?? [];
}
export async function setGlobalRewards(redis, rewards) {
    await redis.set(keys.global.rewards, rewards);
}
export async function updateGlobalReward(redis, rewardId, updates) {
    const rewards = await getGlobalRewards(redis);
    const idx = rewards.findIndex((r) => r.id === rewardId);
    if (idx === -1)
        return null;
    rewards[idx] = { ...rewards[idx], ...updates };
    await setGlobalRewards(redis, rewards);
    return rewards[idx];
}
// ============ CIRCLE CHAT & INVITATIONS ============
export async function getCircleChat(redis, circleName) {
    return (await redis.get(keys.global.circleChat(circleName))) ?? [];
}
export async function setCircleChat(redis, circleName, messages) {
    await redis.set(keys.global.circleChat(circleName), messages);
}
export async function addCircleChatMessage(redis, circleName, message) {
    const messages = await getCircleChat(redis, circleName);
    messages.push(message);
    await setCircleChat(redis, circleName, messages);
}
export async function deleteCircleChatMessage(redis, circleName, messageId) {
    const messages = await getCircleChat(redis, circleName);
    const idx = messages.findIndex((m) => m.id === messageId);
    if (idx === -1)
        return false;
    messages.splice(idx, 1);
    await setCircleChat(redis, circleName, messages);
    return true;
}
export async function toggleCircleChatReaction(redis, circleName, messageId, email, emoji) {
    const messages = await getCircleChat(redis, circleName);
    const message = messages.find((m) => m.id === messageId);
    if (!message)
        return;
    let alreadyHadThisEmoji = false;
    for (const reaction of message.reactions) {
        const idx = reaction.emails.indexOf(email);
        if (idx !== -1) {
            if (reaction.emoji === emoji)
                alreadyHadThisEmoji = true;
            reaction.emails.splice(idx, 1);
        }
    }
    if (!alreadyHadThisEmoji) {
        let reaction = message.reactions.find((r) => r.emoji === emoji);
        if (!reaction) {
            reaction = { emoji, emails: [] };
            message.reactions.push(reaction);
        }
        reaction.emails.push(email);
    }
    await setCircleChat(redis, circleName, messages);
}
export async function getCircleInvitations(redis, circleName) {
    return (await redis.get(keys.global.circleInvitations(circleName))) ?? [];
}
export async function setCircleInvitations(redis, circleName, invitations) {
    await redis.set(keys.global.circleInvitations(circleName), invitations);
}
export async function addCircleInvitation(redis, circleName, invitation) {
    const invitations = await getCircleInvitations(redis, circleName);
    invitations.push(invitation);
    await setCircleInvitations(redis, circleName, invitations);
}
export async function updateCircleInvitation(redis, circleName, invitationId, updates) {
    const invitations = await getCircleInvitations(redis, circleName);
    const idx = invitations.findIndex((i) => i.id === invitationId);
    if (idx === -1)
        return null;
    invitations[idx] = { ...invitations[idx], ...updates };
    await setCircleInvitations(redis, circleName, invitations);
    return invitations[idx];
}
// ============ ADMIN SESSION ============
export async function setAdminSession(redis, token = "admin") {
    await redis.set(keys.admin.session, token, { ex: 24 * 60 * 60 });
}
export async function getAdminSession(redis) {
    return (await redis.get(keys.admin.session)) ?? null;
}
export async function clearAdminSession(redis) {
    await redis.del(keys.admin.session);
}
// ============ SNAPSHOT BUILDER ============
const LEVELS = ["Explorador", "Catador", "Curador", "Conocedor"];
const POINTS_PER_STUDY = 100;
const POINTS_PER_BADGE = 200;
function streakBonusFor(streak) {
    let bonus = 0;
    if (streak % 3 === 0)
        bonus += 50;
    if (streak % 5 === 0)
        bonus += 75;
    if (streak % 10 === 0)
        bonus += 100;
    return bonus;
}
function freshBadges() {
    return [
        { id: "explorer", name: "Explorador", description: "Completa tu primer estudio sensorial.", earned: false },
        { id: "taster", name: "Catador", description: "Regresa para tres estudios o sesiones grupales.", earned: false },
        { id: "curator", name: "Curador", description: "Ayuda a dar forma a un concepto o da la bienvenida a un nuevo miembro.", earned: false },
        { id: "streaker", name: "Rachero", description: "Alcanza una racha de 5 estudios seguidos.", earned: false },
        { id: "year-completionist", name: "Asistencia Perfecta", description: "Participa en todos los estudios programados para tu círculo en el año.", earned: false },
    ];
}
function freshChallenges() {
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
function circleDefinition(catalog, name, memberCount) {
    const entry = catalog.get(name);
    if (!entry)
        return null;
    return { name, description: entry.description, funFacts: entry.funFacts, limit: entry.limit, memberCount };
}
function memberCountFor(accounts, circleName) {
    let count = 0;
    for (const account of accounts) {
        if (account.member.circles.includes(circleName))
            count += 1;
    }
    return count;
}
function unlockBadge(account, id) {
    const badge = account.badges.find((candidate) => candidate.id === id);
    if (badge && !badge.earned) {
        badge.earned = true;
        account.stats.points += POINTS_PER_BADGE;
    }
}
function toClientMessage(stored, viewerEmail) {
    const reactions = stored.reactions
        .filter((reaction) => reaction.emails.length > 0)
        .map((reaction) => ({
        emoji: reaction.emoji,
        count: reaction.emails.length,
        reactedByMe: viewerEmail !== null && reaction.emails.includes(viewerEmail),
    }));
    return {
        id: stored.id,
        authorName: stored.authorName,
        authorInitials: stored.authorInitials,
        text: stored.text,
        timestamp: stored.timestamp,
        fromMember: stored.fromMember,
        reactions,
    };
}
export async function buildSnapshot(redis, email) {
    const account = await getAccount(redis, email);
    if (!account)
        throw new Error("Account not found");
    const allAccounts = await getAllAccounts(redis);
    const catalog = await getCircleCatalog(redis);
    const globalSessions = await getGlobalSessions(redis);
    const globalRewards = await getGlobalRewards(redis);
    const myCircles = account.member.circles
        .map((name) => circleDefinition(catalog, name, memberCountFor(allAccounts, name)))
        .filter((c) => c !== null);
    const discoverableCircles = Array.from(catalog.keys())
        .filter((name) => !account.member.circles.includes(name))
        .map((name) => circleDefinition(catalog, name, memberCountFor(allAccounts, name)))
        .filter((c) => c !== null);
    const circleChatByCircle = {};
    const circleInvitationsByCircle = {};
    for (const name of account.member.circles) {
        const [chat, invitations] = await Promise.all([
            getCircleChat(redis, name),
            getCircleInvitations(redis, name),
        ]);
        circleChatByCircle[name] = chat.map((msg) => toClientMessage(msg, email));
        circleInvitationsByCircle[name] = invitations.map((inv) => ({ ...inv }));
    }
    return {
        member: { ...account.member, sensoryProfile: { ...account.member.sensoryProfile }, circles: [...account.member.circles] },
        stats: { ...account.stats },
        passportEntries: account.passportEntries.map((entry) => ({ ...entry })),
        badges: account.badges.map((badge) => ({ ...badge })),
        sessions: globalSessions.map((session) => ({ ...session })),
        challenges: account.challenges.map((challenge) => ({ ...challenge })),
        myCircles,
        circleChatByCircle,
        circleInvitationsByCircle,
        discoverableCircles,
        rewards: globalRewards.map((reward) => ({ ...reward })),
        redeemedRewards: account.redeemedRewards.map((redemption) => ({ ...redemption })),
    };
}
