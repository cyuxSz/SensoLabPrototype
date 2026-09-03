import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Snapshot } from "../types";
import ProgressBar from "./ProgressBar";
import StatCard from "./StatCard";
import StreakFlame from "./StreakFlame";

interface OverviewProps {
  snapshot: Snapshot;
  onNavigate: (view: "passport" | "sessions" | "community") => void;
}

export default function Overview({ snapshot, onNavigate }: OverviewProps) {
  const reduceMotion = useReducedMotion();
  const nextSession = snapshot.sessions[0] ?? null;
  const latestEntry = snapshot.passportEntries[0] ?? null;

  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="flex flex-col gap-5 border-b border-senso-teal/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-senso-orange">Resumen de miembro</div>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-senso-navy sm:text-5xl">
            Tu voz deja huella.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-senso-ink/60 sm:text-base">
            Lleva el registro de los estudios que has ayudado a moldear, los beneficios que has desbloqueado y las próximas formas de participar.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("passport")}
          className="w-fit rounded-xl bg-senso-orange px-4 py-3 text-sm font-bold text-white shadow-md shadow-senso-teal/30 transition hover:bg-senso-orange-dark"
        >
          Abrir pasaporte <ArrowRight className="ml-1 inline h-4 w-4" />
        </button>
      </div>

      <div className="mt-8 rounded-2xl border border-senso-orange/20 bg-gradient-to-r from-senso-orange/10 via-senso-cream to-senso-teal/10 p-6 sm:p-7">
        <StreakFlame streak={snapshot.stats.activeStreak} best={snapshot.stats.bestStreak} />
        <p className="mt-3 text-sm leading-6 text-senso-ink/60">
          Haz un check-in después de cada estudio o sesión para mantener viva tu racha, al estilo Duolingo.
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Puntos" value={snapshot.stats.points.toLocaleString("es-MX")} detail="Canjéalos por recompensas en la tienda." accent="orange" />
        <StatCard label="Estudios completados" value={String(snapshot.stats.completedStudies)} detail="Tu historial de contribución sigue creciendo." accent="teal" />
        <StatCard label="Racha activa" value={`${snapshot.stats.activeStreak} estudios`} detail="Un pequeño ritmo puede volverse un hábito." accent="orange" />
        <StatCard label="Referidos" value={String(snapshot.stats.referrals)} detail="Personas que se unieron por tu círculo." accent="teal" />
        <StatCard label="Beneficios desbloqueados" value={String(snapshot.stats.unlockedBenefits)} detail="Reconocimiento ligado a participación real." accent="orange" />
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-2xl border border-senso-teal/15 bg-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-senso-ink/65">Nivel actual</div>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-senso-navy">{snapshot.member.level}</h2>
            </div>
            <div className="rounded-xl border border-senso-orange/30 bg-senso-orange/10 px-3 py-2 text-center">
              <div className="text-[10px] uppercase tracking-[0.15em] text-senso-ink/65">{snapshot.member.circles.length > 1 ? "Círculos" : "Círculo"}</div>
              <div className="mt-1 text-sm font-semibold text-senso-orange">{snapshot.member.circles.join(" / ") || "Ninguno"}</div>
            </div>
          </div>
          <div className="mt-9">
            <ProgressBar value={snapshot.member.levelProgress} max={snapshot.member.nextLevelAt} label="Camino al siguiente beneficio de miembro" />
          </div>
          <div className="mt-8 grid gap-4 border-t border-senso-teal/10 pt-5 text-sm sm:grid-cols-2">
            <div>
              <div className="text-xs text-senso-ink/65">Próximo beneficio</div>
              <div className="mt-1 font-semibold">Acceso prioritario a sesiones limitadas</div>
            </div>
            <div>
              <div className="text-xs text-senso-ink/65">Tus intereses</div>
              <div className="mt-1 font-semibold">{snapshot.member.interests.join(" / ")}</div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-senso-navy/20 bg-senso-navy p-6 text-white sm:p-8">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">Próxima sesión</div>
          {nextSession ? (
            <>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight">{nextSession.title}</h2>
              <div className="mt-6 space-y-3 border-t border-white/15 pt-5 text-sm">
                <div className="flex justify-between gap-4"><span className="text-white/80">Cuándo</span><span className="text-right">{nextSession.date} / {nextSession.time}</span></div>
                <div className="flex justify-between gap-4"><span className="text-white/80">Formato</span><span className="text-right">{nextSession.format}</span></div>
                <div className="flex justify-between gap-4"><span className="text-white/80">Disponibilidad</span><span className="text-right">{nextSession.slotsLeft} lugares</span></div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("sessions")}
                className="mt-8 w-full rounded-xl border border-white/40 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-senso-navy"
              >
                Ver detalles de la sesión
              </button>
            </>
          ) : (
            <>
              <h2 className="mt-3 text-xl font-extrabold tracking-tight">Aún no tienes sesiones por venir</h2>
              <p className="mt-3 text-sm leading-6 text-white/75">Explora las sesiones disponibles para reservar tu próximo estudio.</p>
              <button
                type="button"
                onClick={() => onNavigate("sessions")}
                className="mt-8 w-full rounded-xl border border-white/40 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-senso-navy"
              >
                Ver sesiones disponibles
              </button>
            </>
          )}
        </section>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-2xl border border-senso-teal/15 bg-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-senso-ink/65">Tu opinión en acción</div>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-senso-navy">Una contribución que sigue visible.</h2>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-senso-orange/10 text-senso-orange" aria-hidden="true"><Sparkles className="h-4 w-4" /></div>
          </div>
          <p className="mt-6 text-sm leading-6 text-senso-ink/60">
            {latestEntry ? latestEntry.contribution : "Aún no tienes contribuciones registradas. Haz tu primer check-in desde Pasaporte para empezar tu historial."}
          </p>
          <div className="mt-6 border-t border-senso-teal/10 pt-4 text-xs text-senso-ink/65">
            {latestEntry ? `${latestEntry.category} / ${latestEntry.date}` : "Sin estudios todavía"}
          </div>
        </section>

        <section className="rounded-2xl border border-senso-teal/15 bg-white p-6 sm:p-8">
          {(() => {
            const featuredCircle = snapshot.myCircles[0] ?? null;
            if (!featuredCircle) {
              return <p className="text-sm text-senso-ink/55">Aún no perteneces a ningún círculo.</p>;
            }
            return (
              <>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-senso-ink/65">
                      Círculo de comunidad{snapshot.myCircles.length > 1 ? ` (1 de ${snapshot.myCircles.length})` : ""}
                    </div>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-senso-navy">{featuredCircle.name}</h2>
                  </div>
                  <div className="text-sm text-senso-ink/65">{featuredCircle.memberCount} / {featuredCircle.limit} miembros</div>
                </div>
                <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-senso-teal/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-senso-teal to-senso-orange"
                    style={{ width: `${(featuredCircle.memberCount / featuredCircle.limit) * 100}%` }}
                  />
                </div>
              </>
            );
          })()}
          <p className="mt-6 max-w-xl text-sm leading-6 text-senso-ink/60">
            Los círculos pequeños dejan espacio para el apoyo entre pares, rituales compartidos y una razón para seguir conectado entre estudios.
          </p>
          <button type="button" onClick={() => onNavigate("community")} className="mt-6 border-b border-senso-teal-dark pb-1 text-sm font-bold text-senso-teal-dark">
            Entrar a la comunidad <ArrowRight className="ml-1 inline h-4 w-4" />
          </button>
        </section>
      </div>
    </motion.div>
  );
}
