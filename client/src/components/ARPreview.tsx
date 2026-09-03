import { useMemo, useState } from "react";
import { Award, Lock } from "lucide-react";
import type { Badge } from "../types";

/** Each badge gets its own distinct placeholder model — a real deployment
 * would replace these with a bespoke 3D medal design per badge. */
const BADGE_MODELS: Record<string, string> = {
  explorer: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
  taster: "https://modelviewer.dev/shared-assets/models/Horse.glb",
  curator: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
  streaker: "https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb",
  "year-completionist": "https://modelviewer.dev/shared-assets/models/RocketShip.glb",
};
const FALLBACK_MODEL = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";

interface ARPreviewProps {
  badges: Badge[];
}

/**
 * The 3D/AR module showcases special earned badges as collectible 3D
 * medals, displayed as a shelf/gallery of every badge (earned and locked),
 * rather than a plain dropdown. Selecting an earned badge loads its own
 * distinct model below; on compatible phones, that model can open in AR.
 */
export default function ARPreview({ badges }: ARPreviewProps) {
  const earnedBadges = useMemo(() => badges.filter((badge) => badge.earned), [badges]);
  const [selectedId, setSelectedId] = useState(earnedBadges[0]?.id ?? "");
  const [modelError, setModelError] = useState(false);

  const selectedBadge = earnedBadges.find((badge) => badge.id === selectedId) ?? earnedBadges[0] ?? null;
  const modelSource = import.meta.env.VITE_MODEL_VIEWER_SRC || (selectedBadge ? BADGE_MODELS[selectedBadge.id] ?? FALLBACK_MODEL : FALLBACK_MODEL);

  function handleSelect(badge: Badge) {
    if (!badge.earned) return;
    setModelError(false);
    setSelectedId(badge.id);
  }

  return (
    <section className="rounded-2xl border border-senso-teal/15 bg-white">
      <div className="flex flex-col gap-3 border-b border-senso-teal/10 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-senso-orange">Módulo experimental</div>
          <h2 className="mt-2 text-xl font-extrabold tracking-tight text-senso-navy">Tus medallas especiales en 3D</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-senso-ink/65">
            Cada insignia especial que ganes se puede ver como una medalla 3D coleccionable en tu
            estantería. En celulares compatibles, la misma medalla puede abrirse en realidad
            aumentada para "colocarla" frente a ti.
          </p>
        </div>
        <div className="rounded-full border border-senso-teal/25 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-senso-teal-dark">
          3D / AR
        </div>
      </div>

      {/* Shelf: every badge, earned and locked, laid out like a trophy shelf */}
      <div className="border-b border-senso-teal/10 bg-senso-teal/5 p-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {badges.map((badge) => {
            const isSelected = selectedBadge?.id === badge.id;
            return (
              <button
                key={badge.id}
                type="button"
                onClick={() => handleSelect(badge)}
                disabled={!badge.earned}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 bg-white p-4 text-center transition ${
                  badge.earned
                    ? isSelected
                      ? "border-senso-orange shadow-md shadow-senso-orange/20"
                      : "border-transparent hover:border-senso-teal/40"
                    : "border-transparent opacity-50"
                } ${badge.earned ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    badge.earned ? "bg-senso-orange/15 text-senso-orange" : "bg-senso-ink/10 text-senso-ink/40"
                  }`}
                >
                  {badge.earned ? <Award className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                </div>
                <div className={`text-xs font-bold ${badge.earned ? "text-senso-navy" : "text-senso-ink/45"}`}>{badge.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {earnedBadges.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center bg-senso-teal/5 p-8 text-center">
          <div>
            <div className="text-sm font-semibold text-senso-navy">Aún no tienes insignias especiales</div>
            <p className="mt-2 max-w-sm text-xs leading-5 text-senso-ink/60">
              Completa check-ins y retos para desbloquear tu primera medalla coleccionable en 3D.
            </p>
          </div>
        </div>
      ) : modelError ? (
        <div className="flex min-h-[260px] items-center justify-center bg-senso-teal/5 p-8 text-center">
          <div>
            <div className="text-sm font-semibold">Vista previa 3D no disponible</div>
            <p className="mt-2 max-w-sm text-xs leading-5 text-senso-ink/65">
              Agrega un archivo `.glb` válido mediante `VITE_MODEL_VIEWER_SRC` para activar este módulo demo.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-senso-teal/5 p-3">
          <model-viewer
            key={selectedBadge?.id}
            src={modelSource}
            alt={`Medalla 3D de muestra para la insignia ${selectedBadge?.name}`}
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            loading="lazy"
            onError={() => setModelError(true)}
          />
          {selectedBadge ? (
            <div className="px-2 pb-2 pt-3 text-center">
              <div className="text-sm font-bold text-senso-navy">{selectedBadge.name}</div>
              <div className="text-xs text-senso-ink/60">{selectedBadge.description}</div>
            </div>
          ) : null}
        </div>
      )}

      <div className="grid gap-4 border-t border-senso-teal/10 p-5 text-xs text-senso-ink/65 sm:grid-cols-3">
        <div>
          <div className="font-semibold text-senso-ink">Escritorio</div>
          <div className="mt-1 leading-5">Rota e inspecciona la medalla en el navegador.</div>
        </div>
        <div>
          <div className="font-semibold text-senso-ink">Móvil compatible</div>
          <div className="mt-1 leading-5">Usa la acción de AR que ofrece el dispositivo y el navegador.</div>
        </div>
        <div>
          <div className="font-semibold text-senso-ink">Nota de producción</div>
          <div className="mt-1 leading-5">Cada medalla usa un modelo de muestra distinto; una medalla real tendría su propio diseño 3D.</div>
        </div>
      </div>
    </section>
  );
}
