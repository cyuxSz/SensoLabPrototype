import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, LogIn, Mail, ShieldCheck, Lock } from "lucide-react";
import Logo from "./Logo";

interface AdminLoginProps {
  busy: boolean;
  errorMessage: string | null;
  onSubmit: (email: string, password: string) => void;
  onBack: () => void;
}

export default function AdminLogin({ busy, errorMessage, onSubmit, onBack }: AdminLoginProps) {
  const reduceMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(email.trim(), password);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-senso-navy p-6">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-7 shadow-xl sm:p-9"
      >
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-xs font-semibold text-senso-ink/60 hover:text-senso-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al inicio
        </button>

        <div className="mt-5"><Logo className="h-9 w-auto" /></div>

        <div className="mt-5 flex items-center gap-2 rounded-xl bg-senso-navy/5 px-3 py-2 text-xs font-semibold text-senso-navy">
          <ShieldCheck className="h-4 w-4" /> Acceso de personal
        </div>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-senso-navy">Panel de administración</h1>
        <p className="mt-2 text-sm leading-6 text-senso-ink/65">Solo para el equipo de SensoLab Solutions.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="admin-email" className="text-xs font-semibold text-senso-ink/70">Correo</label>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-senso-teal/25 bg-senso-cream px-3 py-3 focus-within:border-senso-teal">
              <Mail className="h-4 w-4 text-senso-ink/40" />
              <input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@sensolab.mx" required className="w-full bg-transparent text-sm outline-none" />
            </div>
          </div>
          <div>
            <label htmlFor="admin-password" className="text-xs font-semibold text-senso-ink/70">Contraseña</label>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-senso-teal/25 bg-senso-cream px-3 py-3 focus-within:border-senso-teal">
              <Lock className="h-4 w-4 text-senso-ink/40" />
              <input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" required className="w-full bg-transparent text-sm outline-none" />
            </div>
          </div>

          {errorMessage ? <p className="text-xs font-semibold text-senso-orange-dark">{errorMessage}</p> : null}

          <button
            type="submit"
            disabled={busy || !email.trim() || !password}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-senso-navy px-4 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" /> {busy ? "Entrando..." : "Entrar al panel"}
          </button>
        </form>

        <div className="mt-5 rounded-xl bg-senso-teal/5 p-3 text-[11px] leading-5 text-senso-ink/60">
          Cuenta demo de personal: <strong className="text-senso-navy">admin@sensolab.mx</strong> / <strong className="text-senso-navy">admin2026</strong>
        </div>
      </motion.div>
    </div>
  );
}
