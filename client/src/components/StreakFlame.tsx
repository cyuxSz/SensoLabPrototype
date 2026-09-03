import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Flame } from "lucide-react";

interface StreakFlameProps {
  streak: number;
  best: number;
  size?: "sm" | "lg";
  /** Use "dark" when placed on a dark (navy) card background, so the number
   * and label stay readable instead of using near-black tones meant for
   * light cards. */
  tone?: "light" | "dark";
}

export default function StreakFlame({ streak, best, size = "lg", tone = "light" }: StreakFlameProps) {
  const [justBumped, setJustBumped] = useState(false);
  const [previous, setPrevious] = useState(streak);

  useEffect(() => {
    if (streak > previous) {
      setJustBumped(true);
      const timeout = setTimeout(() => setJustBumped(false), 900);
      setPrevious(streak);
      return () => clearTimeout(timeout);
    }
    setPrevious(streak);
  }, [streak, previous]);

  const isLarge = size === "lg";
  const isDark = tone === "dark";

  return (
    <div className={`flex items-center gap-3 ${isLarge ? "" : "gap-2"}`}>
      <div className="relative">
        <motion.span
          key={streak}
          initial={justBumped ? { scale: 0.6, rotate: -8 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 12 }}
          className="streak-flame flex select-none items-center justify-center text-senso-orange"
          aria-hidden="true"
        >
          <Flame className={isLarge ? "h-9 w-9" : "h-6 w-6"} fill="currentColor" strokeWidth={1.5} />
        </motion.span>
        <AnimatePresence>
          {justBumped ? (
            <motion.span
              initial={{ opacity: 0, y: 0, scale: 0.6 }}
              animate={{ opacity: 1, y: -22, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 text-xs font-bold text-senso-orange"
            >
              +1
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
      <div>
        <div className={`font-bold leading-none ${isDark ? "text-white" : "text-senso-ink"} ${isLarge ? "text-3xl" : "text-xl"}`}>
          {streak} <span className={`text-sm font-semibold ${isDark ? "text-white/75" : "text-senso-ink/65"}`}>estudio{streak === 1 ? "" : "s"}</span>
        </div>
        <div className={`mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${isDark ? "text-white/70" : "text-senso-teal-dark/80"}`}>
          Racha de estudios seguidos · mejor: {best}
        </div>
      </div>
    </div>
  );
}
