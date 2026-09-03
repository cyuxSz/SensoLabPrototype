import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Gift, Volume2, VolumeX, X } from "lucide-react";
import type { Reward } from "../types";

interface RewardRedeemCelebrationProps {
  redemption: { reward: Reward; code: string } | null;
  onDismiss: () => void;
}

const CONFETTI_COLORS = ["#F68D35", "#26A69A", "#2C3E50", "#FFB066", "#6FD0C4"];

function playRedeemChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    const notes = [392.0, 523.25, 659.25, 783.99];
    notes.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.value = freq;
      const start = ctx.currentTime + index * 0.09;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.14, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.35);
    });
    setTimeout(() => ctx.close(), 800);
  } catch {
    // Web Audio unavailable — celebration still works visually.
  }
}

function ConfettiField() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 32 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
        delay: Math.random() * 0.3,
        duration: 1.5 + Math.random() * 1,
        rotate: Math.random() * 360,
        size: 5 + Math.random() * 6,
        drift: (Math.random() - 0.5) * 110,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
          animate={{ y: 400, x: piece.drift, opacity: 0, rotate: piece.rotate }}
          transition={{ duration: piece.duration, delay: piece.delay, ease: "easeIn" }}
          style={{
            position: "absolute",
            left: `${piece.left}%`,
            top: 0,
            width: piece.size,
            height: piece.size * 0.4,
            backgroundColor: piece.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
}

export default function RewardRedeemCelebration({ redemption, onDismiss }: RewardRedeemCelebrationProps) {
  const [soundOn, setSoundOn] = useState(() => typeof window !== "undefined" && window.localStorage.getItem("senso-sound-on") !== "false");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (redemption && soundOn) playRedeemChime();
    setCopied(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redemption]);

  function toggleSound() {
    setSoundOn((current) => {
      const next = !current;
      window.localStorage.setItem("senso-sound-on", String(next));
      return next;
    });
  }

  function copyCode() {
    if (!redemption) return;
    navigator.clipboard?.writeText(redemption.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <AnimatePresence>
      {redemption ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-senso-navy/60 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Recompensa canjeada: ${redemption.reward.title}`}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-7 text-center shadow-2xl"
          >
            <ConfettiField />
            <button type="button" onClick={toggleSound} className="absolute right-12 top-4 rounded-full p-1.5 text-senso-ink/40 hover:bg-senso-teal/10 hover:text-senso-teal-dark" aria-label={soundOn ? "Silenciar sonido" : "Activar sonido"}>
              {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button type="button" onClick={onDismiss} className="absolute right-4 top-4 rounded-full p-1.5 text-senso-ink/40 hover:bg-senso-orange/10 hover:text-senso-orange-dark" aria-label="Cerrar">
              <X className="h-4 w-4" />
            </button>

            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.15 }}
              className="relative z-10 mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-senso-orange to-senso-teal shadow-lg"
            >
              <Gift className="h-12 w-12 text-white" />
            </motion.div>

            <div className="relative z-10 mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-senso-orange">¡Recompensa canjeada!</div>
            <h2 className="relative z-10 mt-2 text-2xl font-extrabold tracking-tight text-senso-navy">{redemption.reward.title}</h2>
            <p className="relative z-10 mt-1 text-sm font-semibold text-senso-teal-dark">{redemption.reward.partnerName} · {redemption.reward.discountLabel}</p>
            <p className="relative z-10 mt-2 text-sm leading-6 text-senso-ink/65">{redemption.reward.description}</p>

            <button
              type="button"
              onClick={copyCode}
              className="relative z-10 mt-5 flex w-full items-center justify-between gap-2 rounded-xl border border-dashed border-senso-teal/30 bg-senso-teal/5 px-4 py-3 text-left"
            >
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-senso-ink/50">Tu código</div>
                <div className="font-mono text-lg font-bold text-senso-navy">{redemption.code}</div>
              </div>
              {copied ? <Check className="h-5 w-5 text-senso-teal-dark" /> : <Copy className="h-5 w-5 text-senso-ink/40" />}
            </button>

            <button type="button" onClick={onDismiss} className="relative z-10 mt-5 w-full rounded-xl bg-senso-orange px-4 py-3 text-sm font-bold text-white hover:bg-senso-orange-dark">
              ¡Genial!
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
