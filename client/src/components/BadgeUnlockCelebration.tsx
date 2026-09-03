import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Award, Volume2, VolumeX, X } from "lucide-react";
import type { Badge } from "../types";

interface BadgeUnlockCelebrationProps {
  badge: Badge | null;
  onDismiss: () => void;
}

const CONFETTI_COLORS = ["#F68D35", "#26A69A", "#2C3E50", "#FFB066", "#6FD0C4"];

function playUnlockChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 — a simple little major arpeggio
    notes.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = freq;
      const start = ctx.currentTime + index * 0.12;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.4);
    });
    setTimeout(() => ctx.close(), 900);
  } catch {
    // Web Audio isn't available in every environment — celebration still works visually without it.
  }
}

function ConfettiField() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
        delay: Math.random() * 0.3,
        duration: 1.6 + Math.random() * 1.1,
        rotate: Math.random() * 360,
        size: 6 + Math.random() * 6,
        drift: (Math.random() - 0.5) * 120,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
          animate={{ y: 420, x: piece.drift, opacity: 0, rotate: piece.rotate }}
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

/**
 * Full celebration shown whenever a new badge is earned: confetti burst,
 * an optional short chime (Web Audio, no external asset needed), and the
 * badge itself presented clearly. Sound preference persists in
 * localStorage across sessions.
 */
export default function BadgeUnlockCelebration({ badge, onDismiss }: BadgeUnlockCelebrationProps) {
  const [soundOn, setSoundOn] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.localStorage.getItem("senso-sound-on") !== "false";
  });

  useEffect(() => {
    if (badge && soundOn) {
      playUnlockChime();
    }
    // Only fire when a new badge object appears, not on every soundOn toggle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [badge]);

  function toggleSound() {
    setSoundOn((current) => {
      const next = !current;
      window.localStorage.setItem("senso-sound-on", String(next));
      return next;
    });
  }

  return (
    <AnimatePresence>
      {badge ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-senso-navy/60 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Insignia desbloqueada: ${badge.name}`}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-7 text-center shadow-2xl"
          >
            <ConfettiField />
            <button
              type="button"
              onClick={toggleSound}
              className="absolute right-12 top-4 rounded-full p-1.5 text-senso-ink/40 hover:bg-senso-teal/10 hover:text-senso-teal-dark"
              aria-label={soundOn ? "Silenciar sonido" : "Activar sonido"}
            >
              {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="absolute right-4 top-4 rounded-full p-1.5 text-senso-ink/40 hover:bg-senso-orange/10 hover:text-senso-orange-dark"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>

            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.15 }}
              className="relative z-10 mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-senso-orange to-senso-teal shadow-lg"
            >
              <Award className="h-12 w-12 text-white" />
            </motion.div>

            <div className="relative z-10 mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-senso-orange">
              ¡Insignia desbloqueada!
            </div>
            <h2 className="relative z-10 mt-2 text-2xl font-extrabold tracking-tight text-senso-navy">{badge.name}</h2>
            <p className="relative z-10 mt-2 text-sm leading-6 text-senso-ink/65">{badge.description}</p>

            <button
              type="button"
              onClick={onDismiss}
              className="relative z-10 mt-6 w-full rounded-xl bg-senso-orange px-4 py-3 text-sm font-bold text-white hover:bg-senso-orange-dark"
            >
              ¡Genial!
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
