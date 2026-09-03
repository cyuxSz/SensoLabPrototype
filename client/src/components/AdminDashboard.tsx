import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { LogOut, Users, MessageSquareWarning, PlusCircle, Send, Trash2, ShieldCheck, ExternalLink } from "lucide-react";
import Logo from "./Logo";
import {
  adminCreateCircle,
  adminCreateCircleInvitation,
  adminDeleteChatMessage,
  adminGetCircleChat,
  adminPostAnnouncement,
  getAdminOverview,
} from "../api";
import type { AdminOverview, ChatMessage } from "../types";

interface AdminDashboardProps {
  onLogout: () => void;
  onBackToLanding: () => void;
}

type Tab = "circles" | "accounts" | "moderation";

export default function AdminDashboard({ onLogout, onBackToLanding }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>("circles");
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [newCircleName, setNewCircleName] = useState("");
  const [newCircleDescription, setNewCircleDescription] = useState("");
  const [newCircleFunFacts, setNewCircleFunFacts] = useState("");
  const [newCircleLimit, setNewCircleLimit] = useState(150);
  const [creatingCircle, setCreatingCircle] = useState(false);

  const [invitationCircle, setInvitationCircle] = useState<string | null>(null);
  const [invitationTitle, setInvitationTitle] = useState("");
  const [invitationDescription, setInvitationDescription] = useState("");
  const [invitationSpots, setInvitationSpots] = useState(10);
  const [invitationIncentive, setInvitationIncentive] = useState("");
  const [creatingInvitation, setCreatingInvitation] = useState(false);

  const [moderationCircle, setModerationCircle] = useState<string | null>(null);
  const [moderationMessages, setModerationMessages] = useState<ChatMessage[]>([]);
  const [moderationLoading, setModerationLoading] = useState(false);
  const [announcementDraft, setAnnouncementDraft] = useState("");
  const [postingAnnouncement, setPostingAnnouncement] = useState(false);

  async function refreshOverview() {
    try {
      const data = await getAdminOverview();
      setOverview(data);
      if (!moderationCircle && data.circles.length > 0) {
        setModerationCircle(data.circles[0].name);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo cargar la información.");
    }
  }

  useEffect(() => {
    refreshOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab === "moderation" && moderationCircle) {
      loadModerationChat(moderationCircle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, moderationCircle]);

  async function loadModerationChat(circleName: string) {
    setModerationLoading(true);
    try {
      const { messages } = await adminGetCircleChat(circleName);
      setModerationMessages(messages);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo cargar el chat.");
    } finally {
      setModerationLoading(false);
    }
  }

  async function handleCreateCircle(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreatingCircle(true);
    setError(null);
    try {
      await adminCreateCircle({
        name: newCircleName.trim(),
        description: newCircleDescription.trim(),
        funFacts: newCircleFunFacts.split("\n").map((line) => line.trim()).filter(Boolean),
        limit: newCircleLimit,
      });
      setNewCircleName("");
      setNewCircleDescription("");
      setNewCircleFunFacts("");
      setNewCircleLimit(150);
      await refreshOverview();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo crear el círculo.");
    } finally {
      setCreatingCircle(false);
    }
  }

  async function handleCreateInvitation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!invitationCircle) return;
    setCreatingInvitation(true);
    setError(null);
    try {
      await adminCreateCircleInvitation(invitationCircle, {
        title: invitationTitle.trim(),
        description: invitationDescription.trim(),
        spotsNeeded: invitationSpots,
        incentive: invitationIncentive.trim(),
      });
      setInvitationTitle("");
      setInvitationDescription("");
      setInvitationSpots(10);
      setInvitationIncentive("");
      setInvitationCircle(null);
      await refreshOverview();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo crear la invitación.");
    } finally {
      setCreatingInvitation(false);
    }
  }

  async function handleDeleteMessage(messageId: string) {
    if (!moderationCircle) return;
    try {
      await adminDeleteChatMessage(moderationCircle, messageId);
      setModerationMessages((current) => current.filter((message) => message.id !== messageId));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo eliminar el mensaje.");
    }
  }

  async function handlePostAnnouncement(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!moderationCircle || !announcementDraft.trim()) return;
    setPostingAnnouncement(true);
    setError(null);
    try {
      const message = await adminPostAnnouncement(moderationCircle, announcementDraft.trim());
      setModerationMessages((current) => [...current, message]);
      setAnnouncementDraft("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo publicar el aviso.");
    } finally {
      setPostingAnnouncement(false);
    }
  }

  return (
    <div className="min-h-screen bg-senso-cream text-senso-ink">
      <header className="border-b border-senso-teal/15 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-auto" />
            <div className="flex items-center gap-1.5 rounded-full bg-senso-navy/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-senso-navy">
              <ShieldCheck className="h-3.5 w-3.5" /> Personal
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onBackToLanding} className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-senso-ink/60 hover:bg-senso-teal/10">
              <ExternalLink className="h-4 w-4" /> Sitio público
            </button>
            <button type="button" onClick={onLogout} className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-senso-ink/60 hover:bg-senso-orange/10 hover:text-senso-orange-dark">
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-senso-navy">Panel de administración</h1>
        <p className="mt-2 text-sm text-senso-ink/65">Gestiona círculos, invitaciones exclusivas y modera el chat de la comunidad.</p>

        <div className="mt-6 flex gap-2 border-b border-senso-teal/15">
          {([
            { id: "circles", label: "Círculos", icon: Users },
            { id: "accounts", label: "Cuentas", icon: ShieldCheck },
            { id: "moderation", label: "Moderación", icon: MessageSquareWarning },
          ] as const).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                tab === item.id ? "border-senso-orange text-senso-orange-dark" : "border-transparent text-senso-ink/50 hover:text-senso-ink"
              }`}
            >
              <item.icon className="h-4 w-4" /> {item.label}
            </button>
          ))}
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-senso-orange/30 bg-senso-orange/5 px-4 py-3 text-sm text-senso-orange-dark">
            {error} <button type="button" onClick={() => setError(null)} className="ml-2 underline">cerrar</button>
          </div>
        ) : null}

        {!overview ? (
          <div className="mt-8 text-sm text-senso-ink/50">Cargando...</div>
        ) : tab === "circles" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {overview.circles.map((circle) => (
                <div key={circle.name} className="rounded-2xl border border-senso-teal/15 bg-white p-5">
                  <h3 className="text-base font-extrabold tracking-tight text-senso-navy">{circle.name}</h3>
                  <p className="mt-2 text-xs leading-5 text-senso-ink/60">{circle.description}</p>
                  <div className="mt-3 text-xs font-semibold text-senso-teal-dark">{circle.memberCount} / {circle.limit} miembros</div>
                  <div className="mt-3 text-[11px] text-senso-ink/50">{circle.funFacts.length} datos curiosos</div>
                  <button
                    type="button"
                    onClick={() => setInvitationCircle(invitationCircle === circle.name ? null : circle.name)}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-senso-teal/25 px-3 py-2 text-xs font-bold text-senso-teal-dark hover:border-senso-teal"
                  >
                    <PlusCircle className="h-3.5 w-3.5" /> Crear invitación
                  </button>
                  {invitationCircle === circle.name ? (
                    <form onSubmit={handleCreateInvitation} className="mt-3 space-y-2 rounded-xl bg-senso-teal/5 p-3">
                      <input
                        value={invitationTitle}
                        onChange={(event) => setInvitationTitle(event.target.value)}
                        placeholder="Título del estudio"
                        required
                        className="w-full rounded-lg border border-senso-teal/20 bg-white px-2.5 py-2 text-xs outline-none focus:border-senso-teal"
                      />
                      <textarea
                        value={invitationDescription}
                        onChange={(event) => setInvitationDescription(event.target.value)}
                        placeholder="Descripción"
                        rows={2}
                        required
                        className="w-full resize-none rounded-lg border border-senso-teal/20 bg-white px-2.5 py-2 text-xs outline-none focus:border-senso-teal"
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min={1}
                          value={invitationSpots}
                          onChange={(event) => setInvitationSpots(Number(event.target.value))}
                          className="w-20 rounded-lg border border-senso-teal/20 bg-white px-2.5 py-2 text-xs outline-none focus:border-senso-teal"
                        />
                        <input
                          value={invitationIncentive}
                          onChange={(event) => setInvitationIncentive(event.target.value)}
                          placeholder="Incentivo"
                          required
                          className="w-full rounded-lg border border-senso-teal/20 bg-white px-2.5 py-2 text-xs outline-none focus:border-senso-teal"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={creatingInvitation}
                        className="w-full rounded-lg bg-senso-orange px-3 py-2 text-xs font-bold text-white hover:bg-senso-orange-dark disabled:opacity-50"
                      >
                        {creatingInvitation ? "Creando..." : "Publicar invitación"}
                      </button>
                    </form>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-dashed border-senso-teal/30 bg-white p-5">
              <h3 className="flex items-center gap-1.5 text-sm font-bold text-senso-navy"><PlusCircle className="h-4 w-4" /> Crear un nuevo círculo</h3>
              <p className="mt-1 text-xs text-senso-ink/55">Sin tocar código — aparece de inmediato para que los miembros lo descubran.</p>
              <form onSubmit={handleCreateCircle} className="mt-4 grid gap-3 sm:grid-cols-2">
                <input
                  value={newCircleName}
                  onChange={(event) => setNewCircleName(event.target.value)}
                  placeholder="Nombre del círculo"
                  required
                  className="rounded-lg border border-senso-teal/20 bg-senso-cream px-3 py-2 text-sm outline-none focus:border-senso-teal"
                />
                <input
                  type="number"
                  min={1}
                  value={newCircleLimit}
                  onChange={(event) => setNewCircleLimit(Number(event.target.value))}
                  placeholder="Límite de miembros"
                  className="rounded-lg border border-senso-teal/20 bg-senso-cream px-3 py-2 text-sm outline-none focus:border-senso-teal"
                />
                <textarea
                  value={newCircleDescription}
                  onChange={(event) => setNewCircleDescription(event.target.value)}
                  placeholder="Descripción del círculo"
                  rows={2}
                  required
                  className="resize-none rounded-lg border border-senso-teal/20 bg-senso-cream px-3 py-2 text-sm outline-none focus:border-senso-teal sm:col-span-2"
                />
                <textarea
                  value={newCircleFunFacts}
                  onChange={(event) => setNewCircleFunFacts(event.target.value)}
                  placeholder="Datos curiosos (uno por línea)"
                  rows={3}
                  className="resize-none rounded-lg border border-senso-teal/20 bg-senso-cream px-3 py-2 text-sm outline-none focus:border-senso-teal sm:col-span-2"
                />
                <button
                  type="submit"
                  disabled={creatingCircle}
                  className="rounded-xl bg-senso-navy px-4 py-2.5 text-sm font-bold text-white hover:brightness-110 disabled:opacity-50 sm:col-span-2"
                >
                  {creatingCircle ? "Creando..." : "Crear círculo"}
                </button>
              </form>
            </div>
          </motion.div>
        ) : tab === "accounts" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 overflow-x-auto rounded-2xl border border-senso-teal/15 bg-white">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-senso-teal/15 text-[11px] uppercase tracking-[0.1em] text-senso-ink/50">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Correo</th>
                  <th className="px-4 py-3">Ciudad</th>
                  <th className="px-4 py-3">Círculos</th>
                  <th className="px-4 py-3">Nivel</th>
                  <th className="px-4 py-3">Estudios</th>
                  <th className="px-4 py-3">Referidos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-senso-teal/10">
                {overview.accounts.map((account) => (
                  <tr key={account.email}>
                    <td className="px-4 py-3 font-semibold text-senso-navy">{account.name}</td>
                    <td className="px-4 py-3 text-senso-ink/65">{account.email}</td>
                    <td className="px-4 py-3 text-senso-ink/65">{account.city}</td>
                    <td className="px-4 py-3 text-senso-ink/65">{account.circles.join(", ") || "—"}</td>
                    <td className="px-4 py-3 text-senso-ink/65">{account.level}</td>
                    <td className="px-4 py-3 text-senso-ink/65">{account.completedStudies}</td>
                    <td className="px-4 py-3 text-senso-ink/65">{account.referrals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 rounded-2xl border border-senso-teal/15 bg-white p-6">
            <label className="text-xs font-semibold text-senso-ink/70">Círculo a moderar</label>
            <select
              value={moderationCircle ?? ""}
              onChange={(event) => setModerationCircle(event.target.value)}
              className="mt-2 w-full max-w-xs rounded-lg border border-senso-teal/25 bg-senso-cream px-3 py-2 text-sm outline-none focus:border-senso-teal"
            >
              {overview.circles.map((circle) => (
                <option key={circle.name} value={circle.name}>{circle.name}</option>
              ))}
            </select>

            <form onSubmit={handlePostAnnouncement} className="mt-4 flex gap-2 rounded-xl bg-senso-navy/5 p-3">
              <input
                value={announcementDraft}
                onChange={(event) => setAnnouncementDraft(event.target.value)}
                placeholder="Escribe un aviso para este círculo (ej. recordatorio de sesión)..."
                maxLength={500}
                className="w-full rounded-lg border border-senso-teal/20 bg-white px-3 py-2 text-sm outline-none focus:border-senso-teal"
              />
              <button
                type="submit"
                disabled={!announcementDraft.trim() || postingAnnouncement}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-senso-navy px-4 py-2 text-sm font-bold text-white hover:brightness-110 disabled:opacity-40"
              >
                <Send className="h-4 w-4" /> {postingAnnouncement ? "..." : "Publicar"}
              </button>
            </form>

            <div className="mt-5 space-y-2">
              {moderationLoading ? (
                <div className="text-sm text-senso-ink/50">Cargando mensajes...</div>
              ) : moderationMessages.length === 0 ? (
                <div className="text-sm text-senso-ink/50">Sin mensajes en este círculo.</div>
              ) : (
                moderationMessages.map((message) => (
                  <div key={message.id} className="flex items-start justify-between gap-3 rounded-xl bg-senso-teal/5 p-3">
                    <div>
                      <div className="text-xs font-semibold text-senso-navy">{message.authorName}</div>
                      <div className="mt-0.5 text-sm text-senso-ink/70">{message.text}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteMessage(message.id)}
                      className="shrink-0 rounded-lg p-1.5 text-senso-ink/40 hover:bg-senso-orange/10 hover:text-senso-orange-dark"
                      aria-label="Eliminar mensaje"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
