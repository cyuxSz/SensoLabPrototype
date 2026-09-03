import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, Lock, LogIn, Mail } from "lucide-react";
import Logo from "./Logo";

interface LoginFormProps {
  busy: boolean;
  errorMessage: string | null;
  onSubmit: (email: string, password: string) => void;
  onBack: () => void;
  onGoToSignup: () => void;
}

export default function LoginForm({ busy, errorMessage, onSubmit, onBack, onGoToSignup }: LoginFormProps) {
  const reduceMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(email.trim(), password);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-senso-cream p-6">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md rounded-3xl border border-senso-teal/15 bg-white p-7 shadow-xl shadow-senso-teal/10 sm:p-9"
      >
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-xs font-semibold text-senso-ink/60 hover:text-senso-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al inicio
        </button>

        <div className="mt-5">
          <Logo className="h-9 w-auto" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-senso-navy">Inicia sesión</h1>
        <p className="mt-2 text-sm leading-6 text-senso-ink/65">Entra a tu Sensory Passport para continuar tu recorrido.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="login-email" className="text-xs font-semibold text-senso-ink/70">Correo</label>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-senso-teal/25 bg-senso-cream px-3 py-3 focus-within:border-senso-teal">
              <Mail className="h-4 w-4 text-senso-ink/40" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@correo.com"
                required
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>
          <div>
            <label htmlFor="login-password" className="text-xs font-semibold text-senso-ink/70">Contraseña</label>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-senso-teal/25 bg-senso-cream px-3 py-3 focus-within:border-senso-teal">
              <Lock className="h-4 w-4 text-senso-ink/40" />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          {errorMessage ? <p className="text-xs font-semibold text-senso-orange-dark">{errorMessage}</p> : null}

          <button
            type="submit"
            disabled={busy || !email.trim() || !password}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-senso-orange px-4 py-3 text-sm font-bold text-white shadow-md shadow-senso-teal/30 transition hover:bg-senso-orange-dark disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" /> {busy ? "Entrando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="mt-5 rounded-xl bg-senso-teal/5 p-3 text-[11px] leading-5 text-senso-ink/60">
          Cuenta demo ya disponible: <strong className="text-senso-navy">alex@demo.com</strong> / <strong className="text-senso-navy">senso2026</strong>
        </div>

        <p className="mt-5 text-center text-sm text-senso-ink/60">
          ¿No tienes cuenta?{" "}
          <button type="button" onClick={onGoToSignup} className="font-bold text-senso-teal-dark hover:underline">
            Créala aquí
          </button>
        </p>
      </motion.div>
    </div>
  );
}
