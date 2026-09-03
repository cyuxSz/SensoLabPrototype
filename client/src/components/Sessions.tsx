import { motion, useReducedMotion } from "motion/react";
import type { Density, Session } from "../types";

interface SessionsProps {
  sessions: Session[];
  busySessionId: string | null;
  onReserve: (sessionId: string) => void;
  density?: Density;
}

export default function Sessions({ sessions, busySessionId, onReserve, density = "comfortable" }: SessionsProps) {
  const reduceMotion = useReducedMotion();
  const compact = density === "compact";

  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="border-b border-senso-teal/15 pb-8">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-senso-orange">Invitaciones próximas</div>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-senso-navy sm:text-5xl">Elige lo que va contigo.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-senso-ink/60 sm:text-base">
          Las sesiones se muestran por afinidad, no por volumen. Cada invitación incluye lo que necesitas saber antes de decidir.
        </p>
      </div>

      <div className={compact ? "mt-4 space-y-2" : "mt-8 space-y-4"}>
        {sessions.map((session) => {
          const reserved = session.status === "reserved";
          const busy = busySessionId === session.id;
          return (
            <article key={session.id} className={`rounded-2xl border border-senso-teal/15 bg-white ${compact ? "p-3 sm:p-4" : "p-5 sm:p-7"}`}>
              <div className={`flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between ${compact ? "gap-3" : ""}`}>
                <div className="max-w-2xl">
                  <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-senso-teal-dark">
                    <span className="rounded-full border border-senso-teal/25 bg-senso-teal/5 px-2 py-1">{session.category}</span>
                    <span className="rounded-full border border-senso-teal/25 bg-senso-teal/5 px-2 py-1">{session.format}</span>
                  </div>
                  <h2 className={`font-extrabold tracking-tight text-senso-ink ${compact ? "mt-2 text-base" : "mt-4 text-2xl"}`}>{session.title}</h2>
                  {!compact ? (
                    <p className="mt-3 text-sm leading-6 text-senso-ink/60">
                      Una sesión en grupo pequeño diseñada para explorar atributos del producto y comparar cómo describe la experiencia cada persona.
                    </p>
                  ) : null}
                </div>
                <div className={`min-w-[180px] border-l border-senso-teal/10 pl-5 lg:text-right ${compact ? "text-xs" : ""}`}>
                  <div className="text-xs text-senso-ink/65">{session.date}</div>
                  <div className="mt-1 text-sm font-semibold">{session.time}</div>
                  {!compact ? <div className="mt-1 text-xs text-senso-ink/65">{session.duration}</div> : null}
                </div>
              </div>

              <div className={`grid gap-4 border-t border-senso-teal/10 text-sm sm:grid-cols-3 ${compact ? "mt-3 pt-3" : "mt-7 pt-5"}`}>
                <div><div className="text-xs text-senso-ink/65">Lugares</div><div className="mt-1 font-semibold">{session.slotsLeft} disponibles</div></div>
                <div><div className="text-xs text-senso-ink/65">Valor para el participante</div><div className="mt-1 font-semibold">{session.incentive}</div></div>
                <div className="flex items-end sm:justify-end">
                  <button
                    type="button"
                    disabled={reserved || busy}
                    onClick={() => onReserve(session.id)}
                    className={`w-full rounded-xl px-4 text-sm font-bold transition sm:w-auto ${compact ? "py-2" : "py-3"} ${
                      reserved
                        ? "bg-senso-teal/10 text-senso-ink/60"
                        : "bg-senso-orange text-white shadow-md shadow-senso-teal/30 hover:bg-senso-orange-dark"
                    }`}
                  >
                    {busy ? "Guardando..." : reserved ? "Reservado" : "Reservar lugar"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {!compact ? (
        <div className="mt-8 rounded-2xl border border-dashed border-senso-orange/30 bg-senso-orange/5 p-5 text-sm leading-6 text-senso-ink/60">
          <span className="font-bold text-senso-ink">Nota de transparencia.</span> Este pretotipo no procesa pagos reales ni datos personales. Una invitación de producción indicaría el incentivo aprobado, el canal de pago, el momento, la elegibilidad y los términos de privacidad antes de confirmar.
        </div>
      ) : null}
    </motion.div>
  );
}
