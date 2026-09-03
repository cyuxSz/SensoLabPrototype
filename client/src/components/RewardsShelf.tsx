import { motion, useReducedMotion } from "motion/react";
import { Award, Coins, Gift, Package, Percent, Sparkles, Star, Zap, type LucideIcon } from "lucide-react";
import type { RedeemedReward, Reward } from "../types";

interface RewardsShelfProps {
  rewards: Reward[];
  redeemedRewards: RedeemedReward[];
  points: number;
  busyRewardId: string | null;
  onRedeem: (rewardId: string) => void;
}

const ICONS: Record<string, LucideIcon> = {
  zap: Zap,
  gift: Gift,
  percent: Percent,
  sparkles: Sparkles,
  package: Package,
  star: Star,
};

export default function RewardsShelf({ rewards, redeemedRewards, points, busyRewardId, onRedeem }: RewardsShelfProps) {
  const reduceMotion = useReducedMotion();
  const redeemedIds = new Set(redeemedRewards.map((redemption) => redemption.rewardId));

  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="border-b border-senso-teal/15 pb-8">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-senso-orange">Canjea tus puntos</div>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-senso-navy sm:text-5xl">Recompensas</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-senso-ink/65 sm:text-base">
          Gana 100 puntos por cada estudio, 200 por cada insignia, y bonos extra por mantener tu racha
          en 3, 5 y 10 estudios seguidos. Cámbialos por beneficios reales con nuestros aliados.
        </p>
      </div>

      <div className="mt-8 flex items-center gap-4 rounded-2xl border border-senso-navy/20 bg-senso-navy p-6 text-white sm:p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
          <Coins className="h-7 w-7 text-senso-orange-light" />
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">Tu saldo</div>
          <div className="text-3xl font-extrabold tracking-tight">{points.toLocaleString("es-MX")} pts</div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rewards.map((reward) => {
          const Icon = ICONS[reward.icon] ?? Award;
          const alreadyRedeemed = redeemedIds.has(reward.id);
          const redemption = redeemedRewards.find((item) => item.rewardId === reward.id);
          const canAfford = points >= reward.costPoints;
          const soldOut = reward.remaining <= 0;
          const busy = busyRewardId === reward.id;

          return (
            <article
              key={reward.id}
              className={`rounded-2xl border p-6 transition ${alreadyRedeemed ? "border-senso-teal/30 bg-senso-teal/5" : "border-senso-teal/15 bg-white"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-senso-orange/10 text-senso-orange">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-senso-teal/10 px-3 py-1 text-xs font-bold text-senso-teal-dark">{reward.costPoints} pts</span>
              </div>
              <h2 className="mt-4 text-base font-extrabold tracking-tight text-senso-navy">{reward.title}</h2>
              <p className="mt-1 text-xs font-semibold text-senso-orange-dark">{reward.partnerName} · {reward.discountLabel}</p>
              <p className="mt-2 text-sm leading-6 text-senso-ink/65">{reward.description}</p>

              {alreadyRedeemed ? (
                <div className="mt-4 rounded-xl border border-dashed border-senso-teal/30 bg-white px-3 py-2.5 text-center">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-senso-ink/50">Ya canjeado</div>
                  <div className="font-mono text-sm font-bold text-senso-navy">{redemption?.code}</div>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!canAfford || soldOut || busy}
                  onClick={() => onRedeem(reward.id)}
                  className="mt-4 w-full rounded-xl bg-senso-orange px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-senso-teal/30 transition hover:bg-senso-orange-dark disabled:cursor-not-allowed disabled:bg-senso-ink/15 disabled:text-senso-ink/50 disabled:shadow-none"
                >
                  {busy ? "Canjeando..." : soldOut ? "Sin cupos" : canAfford ? "Canjear" : `Te faltan ${reward.costPoints - points} pts`}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </motion.div>
  );
}
