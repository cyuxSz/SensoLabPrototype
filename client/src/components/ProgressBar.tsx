import { motion, useReducedMotion } from "motion/react";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  /** Use "dark" when placed on a dark (navy) card background, so the text
   * stays readable instead of using near-black tones meant for light cards. */
  tone?: "light" | "dark";
}

export default function ProgressBar({ value, max, label, tone = "light" }: ProgressBarProps) {
  const reduceMotion = useReducedMotion();
  const percentage = Math.min(100, Math.round((value / max) * 100));
  const isDark = tone === "dark";

  return (
    <div>
      {label ? (
        <div className={`mb-2 text-xs font-semibold ${isDark ? "text-white/80" : "text-senso-ink/65"}`}>{label}</div>
      ) : null}
      <div
        className={`h-2.5 w-full overflow-hidden rounded-full ${isDark ? "bg-white/15" : "bg-senso-teal/15"}`}
        aria-label={`${percentage}% completo`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-senso-orange to-senso-teal"
          initial={reduceMotion ? false : { width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: reduceMotion ? 0 : 0.55, ease: "easeOut" }}
        />
      </div>
      <div className={`mt-2 flex justify-between text-[11px] font-medium ${isDark ? "text-white/75" : "text-senso-ink/65"}`}>
        <span>{value} completados</span>
        <span>{max} para el siguiente nivel</span>
      </div>
    </div>
  );
}
