import { useState, useTransition, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  addReferral,
  adminLogin as apiAdminLogin,
  adminLogout as apiAdminLogout,
  completeChallenge,
  getSnapshot,
  joinCircle,
  joinPendingCircle,
  login as apiLogin,
  logout as apiLogout,
  reactToMessage,
  redeemReward as apiRedeemReward,
  reserveCircleInvitation,
  reserveSession,
  signup as apiSignup,
  submitCheckIn,
  UnauthorizedError,
  updateProfile,
} from "./api";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import AppShell from "./components/AppShell";
import BadgeUnlockCelebration from "./components/BadgeUnlockCelebration";
import Challenges from "./components/Challenges";
import CheckInPanel from "./components/CheckInPanel";
import Community from "./components/Community";
import DiscoverCircle from "./components/DiscoverCircle";
import LandingPage from "./components/LandingPage";
import LoginForm from "./components/LoginForm";
import Logo from "./components/Logo";
import Overview from "./components/Overview";
import Passport from "./components/Passport";
import Profile from "./components/Profile";
import RewardRedeemCelebration from "./components/RewardRedeemCelebration";
import RewardsShelf from "./components/RewardsShelf";
import Sessions from "./components/Sessions";
import SignupWizard from "./components/SignupWizard";
import type { AppView, Badge, CircleSuggestion, ProfileUpdate, Reward, SignupInput, Snapshot } from "./types";

type Screen = "landing" | "login" | "signup" | "discover-circle" | "portal" | "admin-login" | "admin-portal";

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [suggestion, setSuggestion] = useState<CircleSuggestion | null>(null);
  const [activeView, setActiveView] = useState<AppView>("overview");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkInBusy, setCheckInBusy] = useState(false);
  const [busySessionId, setBusySessionId] = useState<string | null>(null);
  const [busyChallengeId, setBusyChallengeId] = useState<string | null>(null);
  const [busyInvitationId, setBusyInvitationId] = useState<string | null>(null);
  const [busyJoinCircleName, setBusyJoinCircleName] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [referralBusy, setReferralBusy] = useState(false);
  const [newlyEarnedBadge, setNewlyEarnedBadge] = useState<Badge | null>(null);
  const [busyRewardId, setBusyRewardId] = useState<string | null>(null);
  const [redeemedCelebration, setRedeemedCelebration] = useState<{ reward: Reward; code: string } | null>(null);

  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [circleJoinBusy, setCircleJoinBusy] = useState(false);

  const [adminBusy, setAdminBusy] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const adminToken = localStorage.getItem("adminToken");
    if (token) {
      // Validate token by fetching snapshot
      getSnapshot().then((snap) => {
        setSnapshot(snap);
        setActiveView("overview");
        setScreen("portal");
      }).catch(() => {
        localStorage.removeItem("authToken");
      });
    } else if (adminToken) {
      setScreen("admin-portal");
    }
  }, []);

  function navigate(view: AppView) {
    startTransition(() => setActiveView(view));
  }

  async function enterPortal() {
    try {
      const snap = await getSnapshot();
      setSnapshot(snap);
      setActiveView("overview");
      setScreen("portal");
    } catch (requestError) {
      if (!guardUnauthorized(requestError)) {
        setError(requestError instanceof Error ? requestError.message : "No se pudo cargar tu espacio.");
      }
    }
  }

  async function handleLogin(email: string, password: string) {
    setAuthBusy(true);
    setAuthError(null);
    try {
      const result = await apiLogin({ email, password });
      localStorage.setItem("authToken", result.token);
      setSnapshot(result.snapshot);
      setActiveView("overview");
      setScreen("portal");
    } catch (requestError) {
      setAuthError(requestError instanceof Error ? requestError.message : "No se pudo iniciar sesión.");
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleSignup(input: SignupInput) {
    setAuthBusy(true);
    setAuthError(null);
    try {
      const result = await apiSignup(input);
      localStorage.setItem("authToken", result.token);
      setSnapshot(result.snapshot);
      setSuggestion(result.suggestion);
      setScreen("discover-circle");
    } catch (requestError) {
      setAuthError(requestError instanceof Error ? requestError.message : "No se pudo crear tu cuenta.");
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleJoinCircle() {
    setCircleJoinBusy(true);
    try {
      const snap = await joinPendingCircle();
      setSuggestion(null);
      setSnapshot(snap);
      setActiveView("overview");
      setScreen("portal");
    } catch (requestError) {
      if (!guardUnauthorized(requestError)) {
        setError(requestError instanceof Error ? requestError.message : "No se pudo unir al círculo.");
      }
    } finally {
      setCircleJoinBusy(false);
    }
  }

  async function handleLogout() {
    try {
      await apiLogout();
    } catch {
      // Best-effort
    }
    localStorage.removeItem("authToken");
    setSnapshot(null);
    setActiveView("overview");
    setScreen("landing");
  }

  function checkForNewBadge(previous: Snapshot | null, updated: Snapshot) {
    const previousEarned = previous?.badges.filter((badge) => badge.earned).map((badge) => badge.id) ?? [];
    const newBadge = updated.badges.find((badge) => badge.earned && !previousEarned.includes(badge.id));
    if (newBadge) {
      setNewlyEarnedBadge(newBadge);
    }
    return newBadge;
  }

  async function handleReserve(sessionId: string) {
    setBusySessionId(sessionId);
    setError(null);
    try {
      setSnapshot(await reserveSession(sessionId));
      setNotice("Tu lugar quedó reservado.");
    } catch (requestError) {
      if (!guardUnauthorized(requestError)) {
        setError(requestError instanceof Error ? requestError.message : "No se pudo reservar la sesión.");
      }
    } finally {
      setBusySessionId(null);
    }
  }

  async function handleReserveCircleInvitation(circleName: string, invitationId: string) {
    setBusyInvitationId(invitationId);
    setError(null);
    try {
      setSnapshot(await reserveCircleInvitation(circleName, invitationId));
      setNotice("Confirmaste tu lugar en la invitación de tu círculo.");
    } catch (requestError) {
      if (!guardUnauthorized(requestError)) {
        setError(requestError instanceof Error ? requestError.message : "No se pudo confirmar la invitación.");
      }
    } finally {
      setBusyInvitationId(null);
    }
  }

  async function handleJoinAdditionalCircle(circleName: string) {
    setBusyJoinCircleName(circleName);
    setError(null);
    try {
      setSnapshot(await joinCircle(circleName));
      setNotice(`¡Te uniste a ${circleName}!`);
    } catch (requestError) {
      if (!guardUnauthorized(requestError)) {
        setError(requestError instanceof Error ? requestError.message : "No se pudo unir a ese círculo.");
      }
    } finally {
      setBusyJoinCircleName(null);
    }
  }

  async function handleCheckIn(code: string) {
    setCheckInBusy(true);
    setError(null);
    try {
      const updated = await submitCheckIn(code);
      const newBadge = checkForNewBadge(snapshot, updated);
      setSnapshot(updated);
      setCheckInOpen(false);
      if (!newBadge) {
        setNotice(`¡Racha de ${updated.stats.activeStreak} estudios! Tu pasaporte se actualizó.`);
      }
    } catch (requestError) {
      if (!guardUnauthorized(requestError)) {
        setError(requestError instanceof Error ? requestError.message : "No se pudo actualizar el pasaporte.");
      }
    } finally {
      setCheckInBusy(false);
    }
  }

  async function handleProfileSave(update: ProfileUpdate) {
    setProfileSaving(true);
    setError(null);
    try {
      setSnapshot(await updateProfile(update));
      setNotice("Tu perfil se actualizó correctamente.");
    } catch (requestError) {
      if (!guardUnauthorized(requestError)) {
        setError(requestError instanceof Error ? requestError.message : "No se pudo actualizar tu perfil.");
      }
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleChallenge(challengeId: string) {
    setBusyChallengeId(challengeId);
    setError(null);
    try {
      const updated = await completeChallenge(challengeId);
      const newBadge = checkForNewBadge(snapshot, updated);
      setSnapshot(updated);
      if (!newBadge) {
        setNotice("Tu nota se agregó al reto del círculo.");
      }
    } catch (requestError) {
      if (!guardUnauthorized(requestError)) {
        setError(requestError instanceof Error ? requestError.message : "No se pudo completar el reto.");
      }
    } finally {
      setBusyChallengeId(null);
    }
  }

  async function handleReact(circleName: string, messageId: string, emoji: string) {
    setError(null);
    try {
      setSnapshot(await reactToMessage(circleName, messageId, emoji));
    } catch (requestError) {
      if (!guardUnauthorized(requestError)) {
        setError(requestError instanceof Error ? requestError.message : "No se pudo registrar tu reacción.");
      }
    }
  }

  async function handleRedeemReward(rewardId: string) {
    setBusyRewardId(rewardId);
    setError(null);
    try {
      const result = await apiRedeemReward(rewardId);
      setSnapshot(result.snapshot);
      setRedeemedCelebration({ reward: result.reward, code: result.code });
    } catch (requestError) {
      if (!guardUnauthorized(requestError)) {
        setError(requestError instanceof Error ? requestError.message : "No se pudo canjear la recompensa.");
      }
    } finally {
      setBusyRewardId(null);
    }
  }

  async function handleAddReferral() {
    setReferralBusy(true);
    setError(null);
    try {
      const updated = await addReferral();
      const newBadge = checkForNewBadge(snapshot, updated);
      setSnapshot(updated);
      if (!newBadge) {
        setNotice("¡Referido registrado! Revisa tu progreso en Retos.");
      }
    } catch (requestError) {
      if (!guardUnauthorized(requestError)) {
        setError(requestError instanceof Error ? requestError.message : "No se pudo registrar el referido.");
      }
    } finally {
      setReferralBusy(false);
    }
  }

  async function handleAdminLogin(email: string, password: string) {
    setAdminBusy(true);
    setAdminError(null);
    try {
      const result = await apiAdminLogin({ email, password });
      localStorage.setItem("adminToken", result.token);
      setScreen("admin-portal");
    } catch (requestError) {
      setAdminError(requestError instanceof Error ? requestError.message : "No se pudo iniciar sesión de personal.");
    } finally {
      setAdminBusy(false);
    }
  }

  async function handleAdminLogout() {
    try {
      await apiAdminLogout();
    } catch {
    }
    localStorage.removeItem("adminToken");
    setScreen("landing");
  }

  function guardUnauthorized(requestError: unknown) {
    if (requestError instanceof UnauthorizedError) {
      localStorage.removeItem("authToken");
      setSnapshot(null);
      setScreen("landing");
      return true;
    }
    return false;
  }

  if (screen === "admin-login") {
    return <AdminLogin busy={adminBusy} errorMessage={adminError} onSubmit={handleAdminLogin} onBack={() => setScreen("landing")} />;
  }
  if (screen === "admin-portal") {
    return <AdminDashboard onLogout={handleAdminLogout} onBackToLanding={() => setScreen("landing")} />;
  }

  if (screen === "landing") {
    return (
      <LandingPage
        isAuthenticated={snapshot !== null}
        onGoToLogin={() => setScreen("login")}
        onGoToSignup={() => setScreen("signup")}
        onGoToPortal={enterPortal}
        onGoToAdminLogin={() => setScreen("admin-login")}
      />
    );
  }

  if (screen === "login") {
    return (
      <LoginForm
        busy={authBusy}
        errorMessage={authError}
        onSubmit={handleLogin}
        onBack={() => { setAuthError(null); setScreen("landing"); }}
        onGoToSignup={() => { setAuthError(null); setScreen("signup"); }}
      />
    );
  }

  if (screen === "signup") {
    return (
      <SignupWizard
        busy={authBusy}
        errorMessage={authError}
        onSubmit={handleSignup}
        onBack={() => { setAuthError(null); setScreen("landing"); }}
        onGoToLogin={() => { setAuthError(null); setScreen("login"); }}
      />
    );
  }

  if (screen === "discover-circle" && suggestion) {
    return (
      <DiscoverCircle
        suggestion={suggestion}
        busy={circleJoinBusy}
        onJoin={handleJoinCircle}
        onBack={() => setScreen("landing")}
      />
    );
  }

  if (!snapshot) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-senso-cream p-6">
        <div className="w-full max-w-md rounded-3xl border border-senso-teal/15 bg-white p-7 shadow-xl shadow-senso-teal/10">
          <Logo className="h-10 w-auto" />
          <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-senso-orange">
            SensoLab / Sensory Passport
          </div>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-senso-navy">
            Cargando tu espacio de miembro
          </h1>
          {error ? (
            <p className="mt-4 text-sm leading-6 text-senso-ink/65">
              {error} Inicia la API con <code>npm run dev</code> desde la raíz del proyecto.
            </p>
          ) : (
            <div className="mt-5 h-2 animate-pulse rounded-full bg-gradient-to-r from-senso-orange/40 to-senso-teal/40" />
          )}
        </div>
      </div>
    );
  }

  const density = snapshot.member.density;

  let content;
  if (activeView === "overview") {
    content = <Overview snapshot={snapshot} onNavigate={navigate} />;
  } else if (activeView === "passport") {
    content = <Passport snapshot={snapshot} onCheckIn={() => setCheckInOpen(true)} density={density} />;
  } else if (activeView === "sessions") {
    content = <Sessions sessions={snapshot.sessions} busySessionId={busySessionId} onReserve={handleReserve} density={density} />;
  } else if (activeView === "community") {
    content = (
      <Community
        myCircles={snapshot.myCircles}
        discoverableCircles={snapshot.discoverableCircles}
        challenges={snapshot.challenges}
        circleChatByCircle={snapshot.circleChatByCircle}
        circleInvitationsByCircle={snapshot.circleInvitationsByCircle}
        busyInvitationId={busyInvitationId}
        busyJoinCircleName={busyJoinCircleName}
        referralBusy={referralBusy}
        onReact={handleReact}
        onReserveCircleInvitation={handleReserveCircleInvitation}
        onJoinCircle={handleJoinAdditionalCircle}
        onAddReferral={handleAddReferral}
        onGoToChallenges={() => navigate("challenges")}
      />
    );
  } else if (activeView === "challenges") {
    content = (
      <Challenges challenges={snapshot.challenges} busyChallengeId={busyChallengeId} onCompleteChallenge={handleChallenge} density={density} />
    );
  } else if (activeView === "rewards") {
    content = (
      <RewardsShelf
        rewards={snapshot.rewards}
        redeemedRewards={snapshot.redeemedRewards}
        points={snapshot.stats.points}
        busyRewardId={busyRewardId}
        onRedeem={handleRedeemReward}
      />
    );
  } else {
    content = (
      <Profile member={snapshot.member} stats={snapshot.stats} saving={profileSaving} onSave={handleProfileSave} />
    );
  }

  return (
    <AppShell
      activeView={activeView}
      member={snapshot.member}
      stats={snapshot.stats}
      isPending={isPending}
      onNavigate={navigate}
      onLogout={handleLogout}
      onGoToLanding={() => setScreen("landing")}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={activeView} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          {content}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {notice ? (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="fixed bottom-5 right-5 z-40 max-w-sm rounded-2xl bg-senso-navy px-4 py-3 text-sm text-white shadow-2xl shadow-senso-navy/40"
          >
            <div className="flex items-start gap-4">
              <span>{notice}</span>
              <button type="button" onClick={() => setNotice(null)} className="text-xs text-white/70 hover:text-white">
                Cerrar
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {error ? (
        <div className="fixed bottom-5 left-5 z-40 max-w-sm rounded-2xl border border-senso-orange/40 bg-white px-4 py-3 text-sm text-senso-ink shadow-2xl">
          <div className="flex items-start gap-4">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} className="text-xs text-senso-ink/60 hover:text-senso-ink">
              Cerrar
            </button>
          </div>
        </div>
      ) : null}

      {checkInOpen ? <CheckInPanel busy={checkInBusy} onClose={() => setCheckInOpen(false)} onSubmit={handleCheckIn} /> : null}

      <BadgeUnlockCelebration badge={newlyEarnedBadge} onDismiss={() => setNewlyEarnedBadge(null)} />
      <RewardRedeemCelebration redemption={redeemedCelebration} onDismiss={() => setRedeemedCelebration(null)} />
    </AppShell>
  );
}