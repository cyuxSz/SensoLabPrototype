import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Compass, Flame, Handshake, Lightbulb, Megaphone, Sparkles, Trophy, Users } from "lucide-react";
import type { CircleDefinition, CircleInvitation, ChatMessage, CommunityChallenge } from "../types";
import { REACTION_EMOJIS } from "../types";
import CircleIllustration from "./CircleIllustration";

interface CommunityProps {
  myCircles: CircleDefinition[];
  discoverableCircles: CircleDefinition[];
  challenges: CommunityChallenge[];
  circleChatByCircle: Record<string, ChatMessage[]>;
  circleInvitationsByCircle: Record<string, CircleInvitation[]>;
  busyInvitationId: string | null;
  busyJoinCircleName: string | null;
  referralBusy: boolean;
  onReact: (circleName: string, messageId: string, emoji: string) => void;
  onReserveCircleInvitation: (circleName: string, invitationId: string) => void;
  onJoinCircle: (circleName: string) => void;
  onAddReferral: () => void;
  onGoToChallenges: () => void;
}

function formatChatTime(isoDate: string) {
  try {
    return new Date(isoDate).toLocaleString("es-MX", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

/**
 * WhatsApp-Channel style: SensoLab posts announcements, members can only
 * react (tap an emoji to toggle it) — no free-text input for members.
 */
function AnnouncementChannel({ messages, onReact }: { messages: ChatMessage[]; onReact: (messageId: string, emoji: string) => void }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  return (
    <div className="max-h-96 min-h-[220px] space-y-3 overflow-y-auto rounded-xl bg-senso-teal/5 p-4">
      {messages.length === 0 ? (
        <p className="py-8 text-center text-xs text-senso-ink/50">SensoLab aún no ha publicado avisos en este círculo.</p>
      ) : null}
      {messages.map((message) => (
        <div key={message.id} className="rounded-2xl bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-senso-navy text-[10px] font-bold text-white">
              {message.authorInitials}
            </div>
            <div className="text-[11px] font-semibold text-senso-ink/60">{message.authorName} · {formatChatTime(message.timestamp)}</div>
          </div>
          <div className="mt-2 text-sm leading-6 text-senso-ink">{message.text}</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {REACTION_EMOJIS.map((emoji) => {
              const summary = message.reactions.find((reaction) => reaction.emoji === emoji);
              const count = summary?.count ?? 0;
              const reacted = summary?.reactedByMe ?? false;
              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onReact(message.id, emoji)}
                  className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs transition ${
                    reacted ? "border-senso-orange bg-senso-orange/10" : "border-senso-teal/15 hover:border-senso-teal/40"
                  }`}
                >
                  <span>{emoji}</span>
                  {count > 0 ? <span className="font-semibold text-senso-ink/60">{count}</span> : null}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default function Community({
  myCircles,
  discoverableCircles,
  challenges,
  circleChatByCircle,
  circleInvitationsByCircle,
  busyInvitationId,
  busyJoinCircleName,
  referralBusy,
  onReact,
  onReserveCircleInvitation,
  onJoinCircle,
  onAddReferral,
  onGoToChallenges,
}: CommunityProps) {
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState(myCircles[0]?.name ?? "");
  const activeCircle = myCircles.find((circle) => circle.name === selected) ?? myCircles[0] ?? null;
  const completedCount = challenges.filter((challenge) => challenge.completed).length;

  if (!activeCircle) {
    return (
      <div className="rounded-2xl border border-senso-teal/15 bg-white p-8 text-center text-sm text-senso-ink/60">
        Aún no perteneces a ningún círculo.
      </div>
    );
  }

  const invitations = circleInvitationsByCircle[activeCircle.name] ?? [];
  const chat = circleChatByCircle[activeCircle.name] ?? [];

  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="border-b border-senso-teal/15 pb-8">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-senso-orange">Un lugar entre estudios</div>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-senso-navy sm:text-5xl">Quédate en el círculo.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-senso-ink/65 sm:text-base">
          Puedes pertenecer a varios círculos a la vez, según tus intereses. Cada uno tiene su propio chat,
          datos curiosos e invitaciones exclusivas.
        </p>
      </div>

      {myCircles.length > 1 ? (
        <div className="mt-6 flex gap-2 overflow-x-auto">
          {myCircles.map((circle) => (
            <button
              key={circle.name}
              type="button"
              onClick={() => setSelected(circle.name)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeCircle.name === circle.name ? "bg-senso-navy text-white" : "bg-senso-teal/10 text-senso-teal-dark hover:bg-senso-teal/20"
              }`}
            >
              {circle.name}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-senso-navy/20 bg-senso-navy p-6 text-white sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <CircleIllustration circleName={activeCircle.name} className="h-16 w-16 shrink-0" />
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">Tu círculo</div>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{activeCircle.name}</h2>
              </div>
            </div>
            <div className="rounded-full border border-white/30 px-3 py-2 text-sm">{activeCircle.memberCount} / {activeCircle.limit}</div>
          </div>
          <p className="mt-8 max-w-xl text-sm leading-6 text-white/75">{activeCircle.description}</p>
          <div className="mt-8 grid gap-3 border-t border-white/15 pt-5 text-sm sm:grid-cols-2">
            <div><div className="text-xs text-white/75">Ritual compartido</div><div className="mt-1">Una nota sensorial después de cada sesión</div></div>
            <div><div className="text-xs text-white/75">Apoyo entre pares</div><div className="mt-1">Dar la bienvenida a nuevos miembros del círculo</div></div>
          </div>
        </section>

        <section className="rounded-2xl border border-senso-teal/15 bg-white p-6 sm:p-8">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-senso-ink/65">Ciclo de referidos</div>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-senso-navy">Invita a alguien que encaje.</h2>
          <p className="mt-4 text-sm leading-6 text-senso-ink/65">
            El reconocimiento por referidos está pensado para premiar una introducción relevante, no una invitación masiva.
          </p>
          <div className="mt-6 flex items-center justify-between rounded-xl border border-senso-teal/15 bg-senso-teal/5 px-3 py-3 text-xs">
            <code className="truncate text-senso-ink/65">sensolab.example/join/AM-02</code>
            <button
              type="button"
              className="ml-3 shrink-0 border-b border-senso-teal-dark pb-0.5 font-bold text-senso-teal-dark"
              onClick={() => navigator.clipboard?.writeText("sensolab.example/join/AM-02")}
            >
              Copiar enlace
            </button>
          </div>
          <button
            type="button"
            onClick={onAddReferral}
            disabled={referralBusy}
            className="mt-3 w-full rounded-xl border border-dashed border-senso-orange/40 px-4 py-2.5 text-xs font-semibold text-senso-orange-dark hover:bg-senso-orange/5 disabled:opacity-50"
          >
            {referralBusy ? "Registrando..." : "Simular que alguien se registró con tu enlace (demo)"}
          </button>
        </section>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <section className="rounded-2xl border border-senso-teal/15 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-senso-ink/65">
            <Megaphone className="h-3.5 w-3.5" /> Canal de avisos del círculo
          </div>
          <h2 className="mt-2 text-xl font-extrabold tracking-tight text-senso-navy">{activeCircle.name}</h2>
          <p className="mt-2 text-xs leading-5 text-senso-ink/60">
            SensoLab publica los avisos; tú puedes reaccionar tocando un emoji.
          </p>
          <div className="mt-5">
            <AnnouncementChannel messages={chat} onReact={(messageId, emoji) => onReact(activeCircle.name, messageId, emoji)} />
          </div>
        </section>

        <section className="rounded-2xl border border-senso-teal/15 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-senso-ink/65">
            <Sparkles className="h-3.5 w-3.5" /> Datos curiosos de tu círculo
          </div>
          <h2 className="mt-2 text-xl font-extrabold tracking-tight text-senso-navy">Para {activeCircle.name}</h2>
          <p className="mt-2 text-xs leading-5 text-senso-ink/60">
            Estos datos cambian según tu círculo — aquí verías curiosidades relacionadas con lo que evalúas.
          </p>
          <ul className="mt-5 space-y-3">
            {activeCircle.funFacts.map((fact, index) => (
              <li key={index} className="flex gap-2 rounded-xl bg-senso-orange/5 p-3 text-xs leading-5 text-senso-ink/75">
                <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-senso-orange" /> {fact}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {invitations.length > 0 ? (
        <section className="mt-8 rounded-2xl border border-senso-orange/30 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-senso-orange">Invitación exclusiva de tu círculo</div>
              <h2 className="mt-2 text-xl font-extrabold tracking-tight text-senso-navy">Distinta de las invitaciones generales</h2>
              <p className="mt-2 max-w-2xl text-xs leading-5 text-senso-ink/60">
                A veces SensoLab necesita a un número específico de personas de UN círculo en particular
                para un estudio muy puntual — esto es diferente de las sesiones generales en "Sesiones".
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {invitations.map((invitation) => {
              const reserved = invitation.status === "reserved";
              const busy = busyInvitationId === invitation.id;
              const remaining = Math.max(0, invitation.spotsNeeded - invitation.spotsFilled);
              return (
                <div key={invitation.id} className="rounded-xl border border-senso-teal/15 p-5">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-senso-orange">
                    <span className="rounded-full border border-senso-orange/30 bg-senso-orange/10 px-2 py-1">{invitation.category}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-extrabold tracking-tight text-senso-navy">{invitation.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-senso-ink/65">{invitation.description}</p>
                  <div className="mt-4 grid gap-3 border-t border-senso-teal/10 pt-4 text-xs sm:grid-cols-3">
                    <div><div className="text-senso-ink/55">Cupos</div><div className="mt-1 font-semibold text-senso-navy">{invitation.spotsFilled}/{invitation.spotsNeeded} ({remaining} disponibles)</div></div>
                    <div><div className="text-senso-ink/55">Incentivo</div><div className="mt-1 font-semibold text-senso-navy">{invitation.incentive}</div></div>
                    <div className="flex items-end sm:justify-end">
                      <button
                        type="button"
                        disabled={reserved || busy || remaining === 0}
                        onClick={() => onReserveCircleInvitation(activeCircle.name, invitation.id)}
                        className={`w-full rounded-xl px-4 py-2.5 text-sm font-bold transition sm:w-auto ${
                          reserved ? "bg-senso-teal/10 text-senso-ink/60" : "bg-senso-orange text-white shadow-md shadow-senso-teal/30 hover:bg-senso-orange-dark"
                        }`}
                      >
                        {busy ? "Guardando..." : reserved ? "Ya confirmaste" : "Quiero participar"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="mt-8 rounded-2xl border border-senso-teal/15 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-senso-ink/65">Tus retos</div>
            <h2 className="mt-2 text-xl font-extrabold tracking-tight text-senso-navy">
              {completedCount} de {challenges.length} completados
            </h2>
            <p className="mt-2 text-xs leading-5 text-senso-ink/60">
              Metas personales, no una tabla de posiciones — mira tu progreso completo en Retos.
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToChallenges}
            className="w-fit rounded-xl bg-senso-orange px-4 py-3 text-sm font-bold text-white shadow-md shadow-senso-teal/30 transition hover:bg-senso-orange-dark"
          >
            Ver todos mis retos →
          </button>
        </div>
      </section>

      {discoverableCircles.length > 0 ? (
        <section className="mt-8 rounded-2xl border border-senso-teal/15 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-senso-ink/65">
            <Compass className="h-3.5 w-3.5" /> Descubre más círculos
          </div>
          <h2 className="mt-2 text-xl font-extrabold tracking-tight text-senso-navy">Puedes unirte a más de uno</h2>
          <p className="mt-2 text-sm leading-6 text-senso-ink/60">
            Únete a otro círculo si tienes intereses adicionales — tendrás acceso a su chat, sus datos
            curiosos y sus invitaciones exclusivas.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {discoverableCircles.map((circle) => {
              const full = circle.memberCount >= circle.limit;
              const busy = busyJoinCircleName === circle.name;
              return (
                <div key={circle.name} className="rounded-2xl border border-senso-teal/15 p-5">
                  <CircleIllustration circleName={circle.name} className="h-14 w-14" />
                  <h3 className="mt-3 text-base font-extrabold tracking-tight text-senso-navy">{circle.name}</h3>
                  <p className="mt-2 text-xs leading-5 text-senso-ink/60">{circle.description}</p>
                  <div className="mt-3 text-[11px] text-senso-ink/50">{circle.memberCount} / {circle.limit} miembros</div>
                  <button
                    type="button"
                    disabled={full || busy}
                    onClick={() => onJoinCircle(circle.name)}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-senso-teal/25 px-3 py-2 text-xs font-bold text-senso-teal-dark hover:border-senso-teal disabled:opacity-40"
                  >
                    <Users className="h-3.5 w-3.5" /> {busy ? "Uniéndote..." : full ? "Círculo lleno" : "Unirme"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-senso-teal/15 bg-white p-5">
          <Handshake className="h-6 w-6 text-senso-teal-dark" />
          <div className="mt-4 text-sm font-semibold">Pertenencia</div>
          <div className="mt-2 text-xs leading-5 text-senso-ink/65">Un círculo con nombre da a las visitas repetidas un contexto social.</div>
        </div>
        <div className="rounded-2xl border border-senso-teal/15 bg-white p-5">
          <Trophy className="h-6 w-6 text-senso-orange" />
          <div className="mt-4 text-sm font-semibold">Reconocimiento</div>
          <div className="mt-2 text-xs leading-5 text-senso-ink/65">El progreso muestra contribución sin reemplazar incentivos justos.</div>
        </div>
        <div className="rounded-2xl border border-senso-teal/15 bg-white p-5">
          <Flame className="h-6 w-6 text-senso-orange" />
          <div className="mt-4 text-sm font-semibold">Continuidad</div>
          <div className="mt-2 text-xs leading-5 text-senso-ink/65">La relación tiene valor incluso entre estudios pagados.</div>
        </div>
      </section>
    </motion.div>
  );
}
