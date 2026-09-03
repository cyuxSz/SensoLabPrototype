import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Cake, Flame, Lock, Mail, MapPin, Sparkles, User, UserPlus, Users } from "lucide-react";
import Logo from "./Logo";
import type { SignupInput } from "../types";

interface SignupWizardProps {
  busy: boolean;
  errorMessage: string | null;
  onSubmit: (input: SignupInput) => void;
  onBack: () => void;
  onGoToLogin: () => void;
}

const CATEGORY_OPTIONS = ["Alimentos", "Bebidas", "Cosméticos", "Cuidado personal", "Farmacéutico"];
const DIETARY_OPTIONS = ["Ninguna", "Vegetariana", "Vegana", "Sin gluten", "Sin lactosa", "Otra"];

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2">
      {[0, 1].map((index) => (
        <div key={index} className={`h-1.5 flex-1 rounded-full ${index <= step ? "bg-gradient-to-r from-senso-orange to-senso-teal" : "bg-senso-teal/15"}`} />
      ))}
    </div>
  );
}

function ChipToggle({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        selected ? "border-senso-orange bg-senso-orange/15 text-senso-orange-dark" : "border-senso-teal/25 text-senso-ink/60 hover:border-senso-teal"
      }`}
    >
      {label}
    </button>
  );
}

export default function SignupWizard({ busy, errorMessage, onSubmit, onBack, onGoToLogin }: SignupWizardProps) {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [city, setCity] = useState("Monterrey");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [categories, setCategories] = useState<string[]>([]);
  const [dietary, setDietary] = useState<string[]>(["Ninguna"]);
  const [spiceSensitivity, setSpiceSensitivity] = useState(3);
  const [sessionFormatPref, setSessionFormatPref] = useState<SignupInput["sessionFormatPref"]>("either");
  const [frequencyPref, setFrequencyPref] = useState<SignupInput["frequencyPref"]>("monthly");

  const step1Valid = name.trim().length > 0 && birthDate.length > 0 && city.trim().length > 0 && email.includes("@") && password.length >= 4;
  const step2Valid = categories.length > 0;

  function toggleFrom(list: string[], setList: (value: string[]) => void, value: string) {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  }

  function toggleDietary(value: string) {
    if (value === "Ninguna") {
      setDietary(["Ninguna"]);
      return;
    }
    const withoutNone = dietary.filter((item) => item !== "Ninguna");
    if (withoutNone.includes(value)) {
      const next = withoutNone.filter((item) => item !== value);
      setDietary(next.length > 0 ? next : ["Ninguna"]);
    } else {
      setDietary([...withoutNone, value]);
    }
  }

  function handleFinalSubmit() {
    onSubmit({
      name: name.trim(),
      birthDate,
      city: city.trim(),
      email: email.trim(),
      password,
      categories,
      dietary,
      spiceSensitivity,
      sessionFormatPref,
      frequencyPref,
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-senso-cream p-6">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl rounded-3xl border border-senso-teal/15 bg-white p-7 shadow-xl shadow-senso-teal/10 sm:p-9"
      >
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 text-xs font-semibold text-senso-ink/60 hover:text-senso-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al inicio
        </button>

        <div className="mt-5 flex items-center justify-between">
          <Logo className="h-9 w-auto" />
          <span className="text-xs font-semibold text-senso-ink/50">Paso {step + 1} de 2</span>
        </div>
        <div className="mt-4"><Stepper step={step} /></div>

        {step === 0 ? (
          <motion.div key="step-0" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-senso-navy">Crea tu cuenta</h1>
            <p className="mt-2 text-sm leading-6 text-senso-ink/65">Empecemos con tus datos generales.</p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-senso-ink/70">Nombre completo</label>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-senso-teal/25 bg-senso-cream px-3 py-3 focus-within:border-senso-teal">
                  <User className="h-4 w-4 text-senso-ink/40" />
                  <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Tu nombre" className="w-full bg-transparent text-sm outline-none" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-senso-ink/70">Fecha de nacimiento</label>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-senso-teal/25 bg-senso-cream px-3 py-3 focus-within:border-senso-teal">
                    <Cake className="h-4 w-4 text-senso-ink/40" />
                    <input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} className="w-full bg-transparent text-sm outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-senso-ink/70">Ciudad</label>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-senso-teal/25 bg-senso-cream px-3 py-3 focus-within:border-senso-teal">
                    <MapPin className="h-4 w-4 text-senso-ink/40" />
                    <input value={city} onChange={(event) => setCity(event.target.value)} className="w-full bg-transparent text-sm outline-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-senso-ink/70">Correo</label>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-senso-teal/25 bg-senso-cream px-3 py-3 focus-within:border-senso-teal">
                  <Mail className="h-4 w-4 text-senso-ink/40" />
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tu@correo.com" className="w-full bg-transparent text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-senso-ink/70">Contraseña</label>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-senso-teal/25 bg-senso-cream px-3 py-3 focus-within:border-senso-teal">
                  <Lock className="h-4 w-4 text-senso-ink/40" />
                  <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo 4 caracteres" className="w-full bg-transparent text-sm outline-none" />
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={!step1Valid}
              onClick={() => setStep(1)}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-senso-orange px-4 py-3 text-sm font-bold text-white shadow-md shadow-senso-teal/30 hover:bg-senso-orange-dark disabled:opacity-40"
            >
              Continuar al perfil sensorial <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div key="step-1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="mt-6 flex items-center gap-2 text-2xl font-extrabold tracking-tight text-senso-navy">
              <Sparkles className="h-5 w-5 text-senso-orange" /> Tu perfil sensorial
            </h1>
            <p className="mt-2 text-sm leading-6 text-senso-ink/65">
              Con esto te sugerimos el círculo que más va contigo (más adelante, un chatbot hará esto por ti).
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <label className="text-xs font-semibold text-senso-ink/70">¿Qué categorías de producto te interesan?</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((option) => (
                    <ChipToggle key={option} label={option} selected={categories.includes(option)} onToggle={() => toggleFrom(categories, setCategories, option)} />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-senso-ink/70">¿Sigues alguna dieta o restricción?</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map((option) => (
                    <ChipToggle key={option} label={option} selected={dietary.includes(option)} onToggle={() => toggleDietary(option)} />
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-senso-ink/70">
                  <Flame className="h-3.5 w-3.5 text-senso-orange" /> ¿Qué tan sensible eres al picante? ({spiceSensitivity}/5)
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={spiceSensitivity}
                  onChange={(event) => setSpiceSensitivity(Number(event.target.value))}
                  className="mt-3 w-full accent-senso-orange"
                />
                <div className="flex justify-between text-[10px] text-senso-ink/45">
                  <span>Muy sensible</span>
                  <span>Me encanta el picante</span>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-senso-ink/70">
                  <Users className="h-3.5 w-3.5" /> ¿Prefieres sesiones individuales o en grupo?
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {([
                    { value: "individual", label: "Individual" },
                    { value: "group", label: "En grupo" },
                    { value: "either", label: "Cualquiera" },
                  ] as const).map((option) => (
                    <ChipToggle key={option.value} label={option.label} selected={sessionFormatPref === option.value} onToggle={() => setSessionFormatPref(option.value)} />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-senso-ink/70">¿Con qué frecuencia te gustaría participar?</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {([
                    { value: "weekly", label: "Semanal" },
                    { value: "monthly", label: "Mensual" },
                    { value: "occasional", label: "Ocasional" },
                  ] as const).map((option) => (
                    <ChipToggle key={option.value} label={option.label} selected={frequencyPref === option.value} onToggle={() => setFrequencyPref(option.value)} />
                  ))}
                </div>
              </div>
            </div>

            {errorMessage ? <p className="mt-4 text-xs font-semibold text-senso-orange-dark">{errorMessage}</p> : null}

            <div className="mt-7 flex gap-3">
              <button type="button" onClick={() => setStep(0)} className="rounded-xl border border-senso-teal/25 px-4 py-3 text-sm font-semibold text-senso-ink/60 hover:border-senso-teal">
                Atrás
              </button>
              <button
                type="button"
                disabled={!step2Valid || busy}
                onClick={handleFinalSubmit}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-senso-orange px-4 py-3 text-sm font-bold text-white shadow-md shadow-senso-teal/30 hover:bg-senso-orange-dark disabled:opacity-40"
              >
                <UserPlus className="h-4 w-4" /> {busy ? "Creando cuenta..." : "Crear mi cuenta"}
              </button>
            </div>
          </motion.div>
        )}

        <p className="mt-6 text-center text-sm text-senso-ink/60">
          ¿Ya tienes cuenta?{" "}
          <button type="button" onClick={onGoToLogin} className="font-bold text-senso-teal-dark hover:underline">
            Inicia sesión
          </button>
        </p>
      </motion.div>
    </div>
  );
}
