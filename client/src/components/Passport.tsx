import { lazy, Suspense } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Award, Coins, Lock } from "lucide-react";
import type { Snapshot } from "../types";
import ProgressBar from "./ProgressBar";
import StreakFlame from "./StreakFlame";

const ARPreview = lazy(() => import("./ARPreview"));

interface PassportProps {
  snapshot: Snapshot;
  onCheckIn: () => void;
  density?: import("../types").Density;
}

export default function Passport({ snapshot, onCheckIn, density = "comfortable" }: PassportProps) {
  const reduceMotion = useReducedMotion();
  const compact = density === "compact";

  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="border-b border-senso-teal/15 pb-8">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-senso-orange">Registro digital</div>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-senso-navy sm:text-5xl">El Pasaporte Sensorial</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-senso-ink/60 sm:text-base">
              Un registro visible de los estudios, experiencias grupales y decisiones de producto que has ayudado a moldear.
            </p>
          </div>
          <button
            type="button"
            onClick={onCheckIn}
            className="w-fit rounded-xl bg-senso-orange px-4 py-3 text-sm font-bold text-white shadow-md shadow-senso-teal/30 transition hover:bg-senso-orange-dark"
          >
            Check-in post-sesión
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-2xl border border-senso-navy/20 bg-senso-navy p-6 text-white sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">Estado de miembro</div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight">{snapshot.member.level}</h2>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-sm font-bold">
              <Coins className="h-4 w-4 text-senso-orange-light" /> {snapshot.stats.points.toLocaleString("es-MX")} pts
            </div>
          </div>
          <div className="mt-10">
            <ProgressBar value={snapshot.member.levelProgress} max={snapshot.member.nextLevelAt} label="Progreso" tone="dark" />
          </div>
          <div className="mt-8 border-t border-white/15 pt-5">
            <StreakFlame streak={snapshot.stats.activeStreak} best={snapshot.stats.bestStreak} size="sm" tone="dark" />
          </div>
        </section>

        <section className="rounded-2xl border border-senso-teal/15 bg-white p-6 sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-senso-ink/65">Camino de reconocimiento</div>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-senso-navy">Insignias ligadas a tu contribución</h2>
            </div>
            <div className="text-xs text-senso-ink/65">{snapshot.badges.filter((badge) => badge.earned).length} obtenidas</div>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {snapshot.badges.map((badge) => (
              <div
                key={badge.id}
                className={`rounded-xl border p-4 transition ${
                  badge.earned
                    ? "border-senso-orange/40 bg-senso-orange/5"
                    : "border-dashed border-senso-teal/20 text-senso-ink/55"
                }`}
              >
                <div className={badge.earned ? "text-senso-orange" : "text-senso-ink/30"}>
                  {badge.earned ? <Award className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </div>
                <div className="mt-2 text-xs font-bold">{badge.name}</div>
                <div className="mt-2 text-[11px] leading-5">{badge.description}</div>
                <div className={`mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] ${badge.earned ? "text-senso-orange" : ""}`}>
                  {badge.earned ? "Obtenida" : "Siguiente"}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-senso-teal/15 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-senso-ink/65">Historial de contribución</div>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-senso-navy">Lo que has ayudado a explorar</h2>
          </div>
          <div className="text-xs text-senso-ink/65">{snapshot.passportEntries.length} estudios registrados</div>
        </div>
        <div className={compact ? "mt-4 divide-y divide-senso-teal/10 border-t border-senso-teal/10" : "mt-8 divide-y divide-senso-teal/10 border-t border-senso-teal/10"}>
          {snapshot.passportEntries.length === 0 ? (
            <p className="py-8 text-center text-sm text-senso-ink/55">
              Aún no tienes estudios registrados. Haz check-in con el código <code className="font-semibold text-senso-navy">SENSO-042</code> para empezar tu historial.
            </p>
          ) : null}
          {snapshot.passportEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={index === 0 ? { opacity: 0, y: -8 } : false}
              animate={{ opacity: 1, y: 0 }}
              className={`grid gap-3 sm:grid-cols-[90px_1fr_1.2fr] sm:gap-6 ${compact ? "py-2.5" : "py-5"}`}
            >
              <div className="text-xs text-senso-ink/65">{entry.date}</div>
              <div>
                <div className="text-sm font-semibold">{entry.title}</div>
                <div className="mt-1 text-xs text-senso-ink/65">{entry.category}</div>
              </div>
              {!compact ? <div className="text-sm leading-6 text-senso-ink/60">{entry.contribution}</div> : null}
              <div className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-senso-teal/40 sm:block">
                0{index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="mt-8">
        <Suspense fallback={<div className="rounded-2xl border border-senso-teal/15 bg-white p-6 text-sm text-senso-ink/65 sm:p-8">Cargando la vista previa 3D...</div>}>
          <ARPreview badges={snapshot.badges} />
        </Suspense>
      </div>
    </motion.div>
  );
}
