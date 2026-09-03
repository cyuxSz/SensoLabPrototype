import type { ReactNode } from "react";
import { Home, BookOpen, FlaskConical, Users, Target, Gift, Settings, LogOut, ExternalLink, type LucideIcon } from "lucide-react";
import type { AppView, Member, Stats } from "../types";
import Logo from "./Logo";
import StreakFlame from "./StreakFlame";

interface AppShellProps {
  activeView: AppView;
  member: Member;
  stats: Stats;
  isPending: boolean;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
  onGoToLanding: () => void;
  children: ReactNode;
}

const navigation: Array<{ id: AppView; label: string; hint: string; icon: LucideIcon }> = [
  { id: "overview", label: "Resumen", hint: "Tu estado actual", icon: Home },
  { id: "passport", label: "Pasaporte", hint: "Historial y progreso", icon: BookOpen },
  { id: "sessions", label: "Sesiones", hint: "Tu próximo estudio", icon: FlaskConical },
  { id: "community", label: "Comunidad", hint: "Círculo, chat y datos curiosos", icon: Users },
  { id: "challenges", label: "Retos", hint: "Tus metas personales", icon: Target },
  { id: "rewards", label: "Recompensas", hint: "Canjea tus puntos", icon: Gift },
  { id: "profile", label: "Perfil", hint: "Tu cuenta y preferencias", icon: Settings },
];

export default function AppShell({ activeView, member, stats, isPending, onNavigate, onLogout, onGoToLanding, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-senso-cream text-senso-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-senso-teal/15 bg-white px-6 py-7 lg:flex lg:flex-col">
        <div className="flex flex-col gap-2">
          <Logo className="h-9 w-auto" chipClassName="px-2.5 py-1.5" />
          <div className="text-[11px] font-extrabold uppercase leading-tight tracking-[0.12em] text-senso-orange">
            Sensory Passport
          </div>
        </div>
        <p className="mt-4 max-w-[210px] text-sm leading-5 text-senso-ink/65">
          Un espacio de miembro para las personas que ayudan a construir lo que sigue.
        </p>

        <div className="mt-6 rounded-2xl bg-gradient-to-br from-senso-orange/10 to-senso-teal/10 p-4">
          <StreakFlame streak={stats.activeStreak} best={stats.bestStreak} />
        </div>

        <nav className="mt-8 space-y-2" aria-label="Navegación principal">
          {navigation.map((item) => {
            const selected = activeView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={selected ? "page" : undefined}
                onClick={() => onNavigate(item.id)}
                className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${
                  selected
                    ? "border-transparent bg-senso-navy text-white shadow-md shadow-senso-teal/30"
                    : "border-transparent text-senso-ink/60 hover:bg-senso-teal/5"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${selected ? "text-white" : "text-senso-teal-dark"}`} strokeWidth={2} />
                <span>
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className={`mt-0.5 block text-xs ${selected ? "text-white/70" : "text-senso-ink/60"}`}>
                    {item.hint}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-senso-teal/15 pt-5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-senso-ink/55">Tu cuenta</div>
          <button
            type="button"
            onClick={() => onNavigate("profile")}
            className={`mt-3 flex w-full items-center justify-between rounded-xl px-2 py-2 text-left transition ${
              activeView === "profile" ? "bg-senso-navy text-white" : "hover:bg-senso-teal/10"
            }`}
          >
            <div>
              <div className="text-sm font-semibold">{member.name}</div>
              <div className={`mt-1 text-xs ${activeView === "profile" ? "text-white/70" : "text-senso-ink/65"}`}>{member.city}</div>
            </div>
            <div
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${
                activeView === "profile" ? "bg-white/20 text-white" : "bg-senso-orange/15 text-senso-orange"
              }`}
            >
              {member.level}
            </div>
          </button>
          <button
            type="button"
            onClick={onGoToLanding}
            className="mt-2 flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-xs font-semibold text-senso-ink/55 transition hover:bg-senso-teal/10 hover:text-senso-teal-dark"
          >
            <ExternalLink className="h-4 w-4" /> Página principal de SensoLab
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="mt-2 flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-xs font-semibold text-senso-ink/50 transition hover:bg-senso-orange/5 hover:text-senso-orange-dark"
          >
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-senso-teal/15 bg-senso-cream/90 px-5 py-4 backdrop-blur lg:px-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-2 lg:hidden">
              <Logo className="h-7 w-auto" />
            </div>
            <div className="hidden text-xs text-senso-ink/65 sm:block">
              {isPending ? "Actualizando tu espacio..." : "Espacio de miembro / modo demo"}
            </div>
            <div className="flex items-center gap-4">
              <div className="lg:hidden">
                <StreakFlame streak={stats.activeStreak} best={stats.bestStreak} size="sm" />
              </div>
              <button
                type="button"
                onClick={() => onNavigate("profile")}
                className="flex items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-senso-teal/10"
                aria-label="Ir a tu perfil"
              >
                <div className="hidden text-right sm:block">
                  <div className="text-sm font-semibold">{member.name}</div>
                  <div className="text-xs text-senso-ink/65">Nivel {member.level}</div>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-senso-navy text-xs font-bold text-white">
                  {member.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                </div>
              </button>
              <button
                type="button"
                onClick={onGoToLanding}
                className="flex rounded-xl p-2 text-senso-ink/50 hover:bg-senso-teal/10 hover:text-senso-teal-dark lg:hidden"
                aria-label="Página principal de SensoLab"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="flex rounded-xl p-2 text-senso-ink/50 hover:bg-senso-orange/5 hover:text-senso-orange-dark lg:hidden"
                aria-label="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <nav className="border-b border-senso-teal/15 bg-senso-cream px-5 py-2 lg:hidden" aria-label="Navegación móvil">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto">
            {navigation.map((item) => {
              const selected = activeView === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={selected ? "page" : undefined}
                  onClick={() => onNavigate(item.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-center text-[11px] font-semibold transition-colors ${
                    selected ? "bg-senso-navy text-white" : "text-senso-ink/65 hover:bg-senso-teal/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        <main className="mx-auto max-w-7xl px-5 py-8 sm:py-10 lg:px-10 lg:py-14">{children}</main>
      </div>
    </div>
  );
}
