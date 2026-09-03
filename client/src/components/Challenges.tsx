import { motion, useReducedMotion } from "motion/react";
import { Flame, CalendarCheck, Handshake, PenLine, Target, Gift } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CommunityChallenge, Density } from "../types";

interface ChallengesProps {
  challenges: CommunityChallenge[];
  busyChallengeId: string | null;
  onCompleteChallenge: (challengeId: string) => void;
  density?: Density;
}

const METRIC_ICON: Record<string, LucideIcon> = {
  streak: Flame,
  sessionsThisYear: CalendarCheck,
  referrals: Handshake,
  circleNotes: PenLine,
};

export default function Challenges({ challenges, busyChallengeId, onCompleteChallenge, density = "comfortable" }: ChallengesProps) {
  const reduceMotion = useReducedMotion();
  const compact = density === "compact";

  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="border-b border-senso-teal/15 pb-8">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-senso-orange">Metas personales</div>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-senso-navy sm:text-5xl">Retos</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-senso-ink/65 sm:text-base">
          Cada reto es personal, no una competencia contra otros miembros. Nuestra encuesta mostró que
          un ranking público no motiva tanto como recompensas concretas — así que aquí encuentras
          progreso claro y beneficios reales, no una tabla de posiciones.
        </p>
      </div>

      <div className={`grid gap-4 sm:grid-cols-2 ${compact ? "mt-4 lg:grid-cols-4" : "mt-8"}`}>
        {challenges.map((challenge) => {
          const percentage = Math.min(100, Math.round((challenge.progress / challenge.target) * 100));
          const isManual = challenge.metric === "circleNotes";
          const busy = busyChallengeId === challenge.id;

          return (
            <article
              key={challenge.id}
              className={`rounded-2xl border transition ${compact ? "p-3" : "p-6"} ${
                challenge.completed ? "border-senso-orange/40 bg-senso-orange/5" : "border-senso-teal/15 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`flex items-center justify-center rounded-xl bg-senso-teal/10 text-senso-teal-dark ${compact ? "h-8 w-8" : "h-10 w-10"}`}>
                  {(() => {
                    const Icon = METRIC_ICON[challenge.metric] ?? Target;
                    return <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} />;
                  })()}
                </div>
                {challenge.completed ? (
                  <span className="rounded-full bg-senso-orange/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-senso-orange">
                    Completado
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-senso-ink/60">
                    {challenge.progress}/{challenge.target}
                  </span>
                )}
              </div>

              <h2 className={`font-extrabold tracking-tight text-senso-navy ${compact ? "mt-2 text-sm" : "mt-4 text-lg"}`}>{challenge.title}</h2>
              {!compact ? <p className="mt-2 text-sm leading-6 text-senso-ink/65">{challenge.description}</p> : null}

              <div className={`overflow-hidden rounded-full bg-senso-teal/10 ${compact ? "mt-3 h-2" : "mt-5 h-2.5"}`}>
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-senso-orange to-senso-teal"
                  initial={reduceMotion ? false : { width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: reduceMotion ? 0 : 0.5 }}
                />
              </div>

              {!compact ? (
                <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-senso-teal/5 px-3 py-2.5 text-xs text-senso-ink/65">
                  <span className="flex items-center gap-1.5"><Gift className="h-3.5 w-3.5 text-senso-orange" /> Recompensa: <strong className="text-senso-navy">{challenge.reward}</strong></span>
                </div>
              ) : null}

              {isManual ? (
                <button
                  type="button"
                  disabled={challenge.completed || busy}
                  onClick={() => onCompleteChallenge(challenge.id)}
                  className={`w-full rounded-xl px-4 text-sm font-bold transition ${compact ? "mt-3 py-2" : "mt-4 py-2.5"} ${
                    challenge.completed
                      ? "bg-senso-teal/10 text-senso-ink/60"
                      : "bg-senso-orange text-white shadow-md shadow-senso-teal/30 hover:bg-senso-orange-dark"
                  }`}
                >
                  {busy ? "Guardando..." : challenge.completed ? "Completado" : "Agregar mi nota"}
                </button>
              ) : !compact ? (
                <p className="mt-4 text-[11px] text-senso-ink/55">
                  Este progreso se actualiza automáticamente con tu actividad en SensoLab.
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </motion.div>
  );
}
