import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CheckCircle2, Flame, LayoutGrid, Rows3, Salad, Users2 } from "lucide-react";
import type { Density, Member, ProfileUpdate, Stats } from "../types";
import StreakFlame from "./StreakFlame";

interface ProfileProps {
  member: Member;
  stats: Stats;
  saving: boolean;
  onSave: (update: ProfileUpdate) => Promise<void>;
}

function formatJoinedDate(isoDate: string) {
  try {
    return new Date(isoDate).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return isoDate;
  }
}

export default function Profile({ member, stats, saving, onSave }: ProfileProps) {
  const reduceMotion = useReducedMotion();

  const safeMember: Member = {
    name: member?.name ?? "",
    birthDate: member?.birthDate ?? "",
    city: member?.city ?? "",
    bio: member?.bio ?? "",
    joinedDate: member?.joinedDate ?? new Date().toISOString(),
    level: member?.level ?? "Explorador",
    levelProgress: member?.levelProgress ?? 0,
    nextLevelAt: member?.nextLevelAt ?? 5,
    circles: member?.circles ?? [],
    interests: member?.interests ?? [],
    notifyByEmail: member?.notifyByEmail ?? true,
    notifyByWhatsapp: member?.notifyByWhatsapp ?? false,
    density: member?.density ?? "comfortable",
    sensoryProfile: member?.sensoryProfile ?? {
      categories: [],
      dietary: [],
      spiceSensitivity: 3,
      sessionFormatPref: "either",
      frequencyPref: "monthly",
    },
  };
  const safeStats: Stats = {
    completedStudies: stats?.completedStudies ?? 0,
    activeStreak: stats?.activeStreak ?? 0,
    bestStreak: stats?.bestStreak ?? 0,
    referrals: stats?.referrals ?? 0,
    unlockedBenefits: stats?.unlockedBenefits ?? 0,
    points: stats?.points ?? 0,
    sessionsThisYear: stats?.sessionsThisYear ?? 0,
    totalSessionsScheduledThisYear: stats?.totalSessionsScheduledThisYear ?? 0,
    lastCheckIn: stats?.lastCheckIn ?? null,
  };

  const [name, setName] = useState(safeMember.name);
  const [city, setCity] = useState(safeMember.city);
  const [bio, setBio] = useState(safeMember.bio);
  const [interests, setInterests] = useState<string[]>(safeMember.interests);
  const [interestDraft, setInterestDraft] = useState("");
  const [notifyByEmail, setNotifyByEmail] = useState(safeMember.notifyByEmail);
  const [notifyByWhatsapp, setNotifyByWhatsapp] = useState(safeMember.notifyByWhatsapp);
  const [density, setDensity] = useState<Density>(safeMember.density);
  const [savedFlash, setSavedFlash] = useState(false);

  const isDirty =
    name !== safeMember.name ||
    city !== safeMember.city ||
    bio !== safeMember.bio ||
    notifyByEmail !== safeMember.notifyByEmail ||
    notifyByWhatsapp !== safeMember.notifyByWhatsapp ||
    density !== safeMember.density ||
    JSON.stringify(interests) !== JSON.stringify(safeMember.interests);

  function addInterest() {
    const value = interestDraft.trim();
    if (!value || interests.includes(value) || interests.length >= 8) {
      setInterestDraft("");
      return;
    }
    setInterests([...interests, value]);
    setInterestDraft("");
  }

  function removeInterest(target: string) {
    setInterests(interests.filter((interest) => interest !== target));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSave({ name, city, bio, interests, notifyByEmail, notifyByWhatsapp, density });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  }

  function handleReset() {
    setName(safeMember.name);
    setCity(safeMember.city);
    setBio(safeMember.bio);
    setInterests(safeMember.interests);
    setNotifyByEmail(safeMember.notifyByEmail);
    setNotifyByWhatsapp(safeMember.notifyByWhatsapp);
    setDensity(safeMember.density);
  }

  const initials = safeMember.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="border-b border-senso-teal/15 pb-8">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-senso-orange">Tu cuenta</div>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-senso-navy sm:text-5xl">Perfil</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-senso-ink/60 sm:text-base">
          Personaliza cómo te ve la comunidad de SensoLab y cómo quieres recibir tus invitaciones.
        </p>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
        <section className="rounded-2xl border border-senso-navy/20 bg-senso-navy p-6 text-white sm:p-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-senso-orange to-senso-orange-light text-2xl font-extrabold text-white shadow-lg">
            {initials}
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight">{safeMember.name}</h2>
          <div className="mt-1 text-sm text-white/80">{safeMember.city}</div>

          <div className="mt-6 border-t border-white/15 pt-5">
            <StreakFlame streak={safeStats.activeStreak} best={safeStats.bestStreak} size="sm" tone="dark" />
          </div>

          <div className="mt-6 space-y-3 border-t border-white/15 pt-5 text-sm">
            <div className="flex justify-between gap-4"><span className="text-white/80">Nivel</span><span className="font-semibold">{safeMember.level}</span></div>
            <div className="flex justify-between gap-4">
              <span className="text-white/80">{safeMember.circles.length > 1 ? "Círculos" : "Círculo"}</span>
              <span className="text-right font-semibold">{safeMember.circles.length > 0 ? safeMember.circles.join(", ") : "Sin círculo"}</span>
            </div>
            <div className="flex justify-between gap-4"><span className="text-white/80">Estudios completados</span><span className="font-semibold">{safeStats.completedStudies}</span></div>
            <div className="flex justify-between gap-4"><span className="text-white/80">Miembro desde</span><span className="text-right font-semibold">{formatJoinedDate(safeMember.joinedDate)}</span></div>
          </div>
        </section>

        <section className="rounded-2xl border border-senso-teal/15 bg-white p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-senso-ink/65">Información básica</div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="profile-name" className="text-xs font-semibold text-senso-ink/70">Nombre</label>
                  <input
                    id="profile-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    maxLength={60}
                    className="mt-2 w-full rounded-xl border border-senso-teal/25 bg-senso-cream px-3 py-3 text-sm outline-none transition focus:border-senso-teal"
                  />
                </div>
                <div>
                  <label htmlFor="profile-city" className="text-xs font-semibold text-senso-ink/70">Ciudad</label>
                  <input
                    id="profile-city"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    maxLength={60}
                    className="mt-2 w-full rounded-xl border border-senso-teal/25 bg-senso-cream px-3 py-3 text-sm outline-none transition focus:border-senso-teal"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="profile-bio" className="text-xs font-semibold text-senso-ink/70">Sobre ti</label>
                <textarea
                  id="profile-bio"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  maxLength={220}
                  rows={3}
                  className="mt-2 w-full resize-none rounded-xl border border-senso-teal/25 bg-senso-cream px-3 py-3 text-sm outline-none transition focus:border-senso-teal"
                />
                <div className="mt-1 text-right text-[11px] text-senso-ink/55">{bio.length}/220</div>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-senso-ink/65">Intereses sensoriales</div>
              <p className="mt-2 text-xs text-senso-ink/65">Usamos esto para invitarte a estudios que realmente te interesen.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="flex items-center gap-2 rounded-full bg-senso-orange/10 px-3 py-1.5 text-xs font-semibold text-senso-orange"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      aria-label={`Quitar interés ${interest}`}
                      className="text-senso-orange/60 hover:text-senso-orange"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  value={interestDraft}
                  onChange={(event) => setInterestDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addInterest();
                    }
                  }}
                  placeholder="Agregar interés (ej. Bebidas frías)"
                  disabled={interests.length >= 8}
                  className="w-full rounded-xl border border-senso-teal/25 bg-senso-cream px-3 py-2.5 text-sm outline-none transition focus:border-senso-teal disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={addInterest}
                  disabled={interests.length >= 8}
                  className="shrink-0 rounded-xl border border-senso-teal/25 px-4 py-2.5 text-sm font-semibold text-senso-teal-dark hover:border-senso-teal disabled:opacity-40"
                >
                  Agregar
                </button>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-senso-ink/65">Tu perfil sensorial</div>
              <p className="mt-2 text-xs leading-5 text-senso-ink/60">
                Esto se llenó al crear tu cuenta y es lo que usamos para sugerirte un círculo. Próximamente
                podrás editarlo aquí también.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-senso-teal/5 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-senso-ink/55">
                    <Salad className="h-3.5 w-3.5" /> Dieta
                  </div>
                  <div className="mt-1.5 text-xs font-semibold text-senso-navy">
                    {safeMember.sensoryProfile.dietary.length > 0 ? safeMember.sensoryProfile.dietary.join(", ") : "Sin especificar"}
                  </div>
                </div>
                <div className="rounded-xl bg-senso-teal/5 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-senso-ink/55">
                    <Flame className="h-3.5 w-3.5" /> Sensibilidad al picante
                  </div>
                  <div className="mt-1.5 text-xs font-semibold text-senso-navy">{safeMember.sensoryProfile.spiceSensitivity}/5</div>
                </div>
                <div className="rounded-xl bg-senso-teal/5 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-senso-ink/55">
                    <Users2 className="h-3.5 w-3.5" /> Formato preferido
                  </div>
                  <div className="mt-1.5 text-xs font-semibold text-senso-navy">
                    {{ individual: "Individual", group: "En grupo", either: "Cualquiera" }[safeMember.sensoryProfile.sessionFormatPref]}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-senso-ink/65">Modo de visualización</div>
              <p className="mt-2 text-xs leading-5 text-senso-ink/60">
                Cómodo deja más espacio de lectura; Compacto muestra más información sin desplazarte.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDensity("comfortable")}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-3 text-xs font-bold transition ${
                    density === "comfortable" ? "border-senso-orange bg-senso-orange/10 text-senso-orange-dark" : "border-senso-teal/20 text-senso-ink/60 hover:border-senso-teal/40"
                  }`}
                >
                  <Rows3 className="h-5 w-5" /> Cómodo
                </button>
                <button
                  type="button"
                  onClick={() => setDensity("compact")}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-3 text-xs font-bold transition ${
                    density === "compact" ? "border-senso-orange bg-senso-orange/10 text-senso-orange-dark" : "border-senso-teal/20 text-senso-ink/60 hover:border-senso-teal/40"
                  }`}
                >
                  <LayoutGrid className="h-5 w-5" /> Compacto
                </button>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-senso-ink/65">Notificaciones</div>
              <div className="mt-3 space-y-3">
                <label className="flex items-center justify-between rounded-xl border border-senso-teal/15 bg-senso-cream px-4 py-3 text-sm">
                  <span>Recibir invitaciones por correo</span>
                  <input
                    type="checkbox"
                    checked={notifyByEmail}
                    onChange={(event) => setNotifyByEmail(event.target.checked)}
                    className="h-5 w-5 accent-senso-teal"
                  />
                </label>
                <label className="flex items-center justify-between rounded-xl border border-senso-teal/15 bg-senso-cream px-4 py-3 text-sm">
                  <span>Recibir recordatorios por WhatsApp</span>
                  <input
                    type="checkbox"
                    checked={notifyByWhatsapp}
                    onChange={(event) => setNotifyByWhatsapp(event.target.checked)}
                    className="h-5 w-5 accent-senso-teal"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-senso-teal/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-senso-ink/60">
                {savedFlash ? <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-senso-teal-dark" /> Perfil actualizado.</span> : isDirty ? "Tienes cambios sin guardar." : "Todo está guardado."}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={!isDirty || saving}
                  className="rounded-xl border border-senso-teal/25 px-4 py-3 text-sm font-semibold text-senso-ink/60 hover:border-senso-teal hover:text-senso-ink disabled:opacity-40"
                >
                  Descartar
                </button>
                <button
                  type="submit"
                  disabled={!isDirty || saving || name.trim().length === 0 || city.trim().length === 0}
                  className="rounded-xl bg-senso-orange px-5 py-3 text-sm font-bold text-white shadow-md shadow-senso-teal/30 transition hover:bg-senso-orange-dark disabled:cursor-not-allowed disabled:bg-senso-ink/15 disabled:text-senso-ink/60 disabled:shadow-none"
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </motion.div>
  );
}
