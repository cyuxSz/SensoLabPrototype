import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Bot, Compass, Lightbulb, Sparkles } from "lucide-react";
import Logo from "./Logo";
import type { CircleSuggestion } from "../types";

interface DiscoverCircleProps {
  suggestion: CircleSuggestion;
  busy: boolean;
  onJoin: () => void;
  onBack: () => void;
}

export default function DiscoverCircle({ suggestion, busy, onJoin, onBack }: DiscoverCircleProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex min-h-screen items-center justify-center bg-senso-cream p-6">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl rounded-3xl border border-senso-teal/15 bg-white p-7 shadow-xl shadow-senso-teal/10 sm:p-9"
      >
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-xs font-semibold text-senso-ink/60 hover:text-senso-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al inicio
        </button>

        <div className="mt-5"><Logo className="h-9 w-auto" /></div>

        <div className="mt-5 flex items-center gap-2 rounded-xl bg-senso-teal/5 px-3 py-2 text-xs font-semibold text-senso-teal-dark">
          <Compass className="h-4 w-4" /> Descubre tu círculo
        </div>

        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-senso-navy">¡Encontramos tu círculo!</h1>
        <p className="mt-3 text-sm leading-6 text-senso-ink/65">{suggestion.matchReason}</p>

        <div className="mt-6 rounded-2xl border border-senso-orange/30 bg-senso-orange/5 p-5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-senso-orange">Círculo sugerido</div>
          <h2 className="mt-2 text-xl font-extrabold tracking-tight text-senso-navy">{suggestion.name}</h2>
          <p className="mt-2 text-sm leading-6 text-senso-ink/70">{suggestion.description}</p>
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-senso-ink/60">
            <Lightbulb className="h-3.5 w-3.5 text-senso-orange" /> Un adelanto de tus datos curiosos
          </div>
          <ul className="mt-3 space-y-2">
            {suggestion.funFacts.map((fact, index) => (
              <li key={index} className="rounded-xl bg-senso-teal/5 p-3 text-xs leading-5 text-senso-ink/70">
                💡 {fact}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={onJoin}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-senso-orange px-4 py-3 text-sm font-bold text-white shadow-md shadow-senso-teal/30 disabled:opacity-50"
        >
          {busy ? "Uniéndote..." : "Entrar a mi círculo"} <ArrowRight className="h-4 w-4" />
        </button>

        <div className="mt-5 flex items-start gap-2 rounded-xl bg-senso-navy/5 p-3 text-[11px] leading-5 text-senso-ink/60">
          <Bot className="mt-0.5 h-4 w-4 shrink-0 text-senso-navy" />
          <span>
            Hoy esta sugerencia usa reglas simples sobre tus respuestas. Próximamente, un chatbot
            conversacional hará estas mismas preguntas y te redirigirá a tu círculo de forma más natural.
          </span>
        </div>
      </motion.div>
    </div>
  );
}
