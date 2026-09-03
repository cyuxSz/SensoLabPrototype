import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Award,
  Beaker,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  Mail,
  MapPin,
  Sparkles,
  Tag,
  UserPlus,
  Users,
} from "lucide-react";
import Logo from "./Logo";
import ImagePlaceholder from "./ImagePlaceholder";

interface LandingPageProps {
  isAuthenticated: boolean;
  onGoToLogin: () => void;
  onGoToSignup: () => void;
  onGoToPortal: () => void;
  onGoToAdminLogin: () => void;
}

const trainedPanelMethods = [
  "Desarrollo de perfil sensorial – Gold Standard",
  "Comparación de perfiles sensoriales entre productos",
  "Diferencias sensoriales por cambios en envase, ingredientes, procesos o almacenamiento",
  "Especificaciones sensoriales y soporte de claims",
  "Mapeo de preferencias",
  "Fecha de caducidad sensorial (métodos acelerados)",
  "Pruebas discriminativas",
];

const consumerStudyMethods = [
  "Nivel de agrado y preferencia",
  "Justo-como-me-gusta (JAR)",
  "Mapeo de preferencia y modelos de rechazo/aceptación",
  "Focus groups",
  "Entrevistas personales y telefónicas",
  "Encuestas electrónicas e impresas",
  "Determinación de la fecha de caducidad sensorial",
];

const additionalServices = [
  { icon: Tag, title: "Etiquetado", detail: "Tablas nutrimentales, declaración de ingredientes y GDA según normativa mexicana y de USA." },
  { icon: ClipboardCheck, title: "Calidad e inocuidad", detail: "Diseño de programas prerrequisito y plan HACCP para cada proceso o producto." },
  { icon: Sparkles, title: "Desarrollo de productos", detail: "Optimización y desarrollo de nuevos productos con asesoría especializada." },
  { icon: GraduationCap, title: "Cursos y talleres", detail: "Formación especializada en evaluación sensorial, calidad e inocuidad." },
  { icon: Award, title: "Capacitación", detail: "Formación y evaluación de paneles sensoriales, internos o externos." },
];

export default function LandingPage({ isAuthenticated, onGoToLogin, onGoToSignup, onGoToPortal, onGoToAdminLogin }: LandingPageProps) {
  const reduceMotion = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-senso-cream text-senso-ink">
      <header className="sticky top-0 z-30 border-b border-senso-teal/15 bg-senso-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-10">
          <Logo className="h-8 w-auto" />
          <nav className="hidden items-center gap-6 text-sm font-semibold text-senso-ink/70 md:flex">
            <a href="#quienes-somos" className="hover:text-senso-navy">Quiénes somos</a>
            <a href="#servicios" className="hover:text-senso-navy">Servicios</a>
            <a href="#participa" className="hover:text-senso-navy">Participa</a>
            <a href="#contacto" className="hover:text-senso-navy">Contacto</a>
          </nav>
          <div className="hidden items-center gap-3 sm:flex">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={onGoToPortal}
                className="flex items-center gap-2 rounded-xl bg-senso-orange px-4 py-2 text-sm font-bold text-white shadow-md shadow-senso-teal/30 hover:bg-senso-orange-dark"
              >
                <LayoutDashboard className="h-4 w-4" /> Ir a mi portal
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onGoToLogin}
                  className="flex items-center gap-2 rounded-xl border border-senso-teal/30 px-4 py-2 text-sm font-semibold text-senso-teal-dark hover:border-senso-teal"
                >
                  <LogIn className="h-4 w-4" /> Iniciar sesión
                </button>
                <button
                  type="button"
                  onClick={onGoToSignup}
                  className="flex items-center gap-2 rounded-xl bg-senso-orange px-4 py-2 text-sm font-bold text-white shadow-md shadow-senso-teal/30 hover:bg-senso-orange-dark"
                >
                  <UserPlus className="h-4 w-4" /> Crear cuenta
                </button>
              </>
            )}
          </div>
          <button
            type="button"
            className="rounded-lg border border-senso-teal/30 px-3 py-2 text-xs font-semibold sm:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            Menú
          </button>
        </div>
        {mobileMenuOpen ? (
          <div className="flex flex-col gap-2 border-t border-senso-teal/15 px-5 py-3 sm:hidden">
            {isAuthenticated ? (
              <button type="button" onClick={onGoToPortal} className="flex items-center gap-2 rounded-xl bg-senso-orange px-4 py-2.5 text-sm font-bold text-white">
                <LayoutDashboard className="h-4 w-4" /> Ir a mi portal
              </button>
            ) : (
              <>
                <button type="button" onClick={onGoToLogin} className="flex items-center gap-2 rounded-xl border border-senso-teal/30 px-4 py-2.5 text-sm font-semibold text-senso-teal-dark">
                  <LogIn className="h-4 w-4" /> Iniciar sesión
                </button>
                <button type="button" onClick={onGoToSignup} className="flex items-center gap-2 rounded-xl bg-senso-orange px-4 py-2.5 text-sm font-bold text-white">
                  <UserPlus className="h-4 w-4" /> Crear cuenta
                </button>
              </>
            )}
          </div>
        ) : null}
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-10 lg:py-20">
        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-senso-orange">Innovando la experiencia sensorial</div>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-senso-navy sm:text-5xl lg:text-6xl">
            Entendemos lo que tus consumidores sienten, antes que nadie más.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-senso-ink/70">
            SensoLab Solutions es una empresa especializada en evaluación sensorial para la industria
            alimentaria, cosmética y farmacéutica. Contamos con personal altamente capacitado,
            infraestructura especializada y técnicas vanguardistas de análisis sensorial y conocimiento
            de consumidores.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={isAuthenticated ? onGoToPortal : onGoToSignup}
              className="flex items-center gap-2 rounded-xl bg-senso-orange px-5 py-3 text-sm font-bold text-white shadow-md shadow-senso-teal/30 hover:bg-senso-orange-dark"
            >
              {isAuthenticated ? <LayoutDashboard className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              {isAuthenticated ? "Ir a mi portal" : "Únete a Sensory Passport"}
            </button>
            <a
              href="#servicios"
              className="flex items-center gap-2 rounded-xl border border-senso-teal/30 px-5 py-3 text-sm font-bold text-senso-teal-dark hover:border-senso-teal"
            >
              Conoce nuestros servicios
            </a>
          </div>
        </motion.div>
      </section>

      {/* QUIÉNES SOMOS + MISIÓN */}
      <section id="quienes-somos" className="mx-auto max-w-7xl px-5 py-12 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-senso-teal/15 bg-white p-6 sm:p-8">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-senso-orange">¿Quiénes somos?</div>
            <p className="mt-4 text-sm leading-7 text-senso-ink/75">
              SensoLab Solutions es una empresa especializada en el área de evaluación sensorial, ofreciendo
              sus servicios a la industria alimentaria, cosmética y farmacéutica. Contamos con personal
              altamente capacitado, infraestructura especializada y técnicas vanguardistas de análisis
              sensorial y conocimiento de consumidores para poder cumplir las necesidades de nuestros clientes.
            </p>
          </div>
          <div className="rounded-2xl border border-senso-navy/20 bg-senso-navy p-6 text-white sm:p-8">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">Nuestra misión</div>
            <p className="mt-4 text-sm leading-7 text-white/85">
              Ofrecer a nuestros clientes las instalaciones, tecnologías de análisis sensorial y de
              conocimiento del consumidor que les permitan llegar a la formulación óptima de su producto,
              de manera rápida y con la confianza de conocerlo tan bien que lograrán cautivar los sentidos
              del consumidor desde su diseño y a lo largo de su vida útil.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="mx-auto max-w-7xl px-5 py-12 lg:px-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-senso-orange">Servicios</div>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-senso-navy sm:text-4xl">
          Herramientas para el éxito comercial de tus productos
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-senso-ink/70">
          SensoLab Solutions pone al alcance diferentes herramientas para el éxito comercial de tus
          productos. Te ayudamos a conseguirlo resolviendo retos y diferentes estrategias de acuerdo a tus
          necesidades, tiempo y recursos. A continuación se presentan algunos de nuestros servicios.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <article className="rounded-2xl border border-senso-teal/15 bg-white p-6">
            <img
              src="/images/panel-entrenado.jpg"
              alt="Cabinas del panel entrenado de SensoLab"
              className="aspect-video w-full rounded-2xl object-cover"
            />
            <div className="mt-5 flex items-center gap-2 text-senso-teal-dark">
              <Beaker className="h-5 w-5" />
              <h3 className="text-lg font-extrabold text-senso-navy">Panel Entrenado</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-senso-ink/70">
              Gracias a la sensibilidad y precisión de nuestro panel entrenado, es posible caracterizar los
              atributos sensoriales de tus productos y evaluar cómo se diferencian o asemejan a otros del
              mercado, así como determinar cómo los ingredientes, procesos, envases y condiciones de
              almacenamiento afectan sus propiedades organolépticas.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-senso-ink/65">
              {trainedPanelMethods.map((item) => (
                <li key={item} className="flex gap-2"><span className="text-senso-orange">•</span>{item}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-senso-teal/15 bg-white p-6">
            <img
              src="/images/estudios-consumidores.jpg"
              alt="Sala de estudio con consumidores de SensoLab"
              className="aspect-video w-full rounded-2xl object-cover"
            />
            <div className="mt-5 flex items-center gap-2 text-senso-teal-dark">
              <Users className="h-5 w-5" />
              <h3 className="text-lg font-extrabold text-senso-navy">Estudios con Consumidores</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-senso-ink/70">
              ¿Cómo cautivar los sentidos de tus consumidores? Nuestras investigaciones de mercado se llevan
              a cabo mediante procesos meticulosos de selección, análisis e interpretación de resultados
              para entender el comportamiento de consumidores específicos y generar retroalimentación
              detallada sobre tus productos.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-senso-ink/65">
              {consumerStudyMethods.map((item) => (
                <li key={item} className="flex gap-2"><span className="text-senso-orange">•</span>{item}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-senso-teal/15 bg-white p-6">
            <img
              src="/images/servicios-adicionales.jpg"
              alt="Muestra de producto para servicios adicionales de SensoLab"
              className="aspect-video w-full rounded-2xl object-cover"
            />
            <div className="mt-5 flex items-center gap-2 text-senso-teal-dark">
              <Sparkles className="h-5 w-5" />
              <h3 className="text-lg font-extrabold text-senso-navy">Servicios Adicionales</h3>
            </div>
            <div className="mt-4 space-y-3">
              {additionalServices.map(({ icon: Icon, title, detail }) => (
                <div key={title} className="flex gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-senso-orange" />
                  <div>
                    <div className="text-xs font-bold text-senso-navy">{title}</div>
                    <div className="text-xs leading-5 text-senso-ink/65">{detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      {/* PARTICIPA + PORTAL CTA */}
      <section id="participa" className="mx-auto max-w-7xl px-5 py-12 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-stretch">
          <div className="rounded-2xl border border-senso-teal/15 bg-white p-6 sm:p-8">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-senso-orange">Participa</div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-senso-navy">
              ¡Únete a nuestro grupo selecto de consumidores!
            </h2>
            <p className="mt-4 text-sm leading-7 text-senso-ink/70">
              La investigación sensorial no es posible sin las personas que desean evaluar nuevos productos.
              Además de apoyar estos estudios, serás recompensado por tu esfuerzo con diferentes incentivos.
              ¡Gracias!
            </p>
          </div>

          <div className="rounded-2xl border border-senso-navy/20 bg-senso-navy p-6 text-white sm:p-8">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">Portal Sensory Passport</div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight">Tu pasaporte sensorial digital</h2>
            <p className="mt-4 text-sm leading-7 text-white/80">
              Regístrate y descubre tu círculo de consumidores ideal, sigue tu historial de estudios,
              tu racha de participación, retos personales y mucho más.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={onGoToPortal}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-senso-orange px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-senso-orange-dark"
                >
                  <LayoutDashboard className="h-4 w-4" /> Ir a mi portal
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onGoToSignup}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-senso-orange px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-senso-orange-dark"
                  >
                    <UserPlus className="h-4 w-4" /> Crear cuenta
                  </button>
                  <button
                    type="button"
                    onClick={onGoToLogin}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/40 px-5 py-3 text-sm font-bold text-white hover:bg-white hover:text-senso-navy"
                  >
                    <LogIn className="h-4 w-4" /> Iniciar sesión
                  </button>
                </>
              )}
            </div>
            <p className="mt-4 text-[11px] leading-5 text-white/60">
              Próximamente: un chatbot te ayudará a encontrar tu círculo ideal automáticamente. Por ahora,
              un breve cuestionario hace esa misma función.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACTO + UBICACIÓN */}
      <footer id="contacto" className="border-t border-senso-teal/15 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-2 lg:px-10">
          <div>
            <div className="flex items-center gap-2 text-senso-teal-dark">
              <MapPin className="h-5 w-5" />
              <h3 className="text-lg font-extrabold text-senso-navy">Ubicación</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-senso-ink/70">
              Centro de Innovación y Transferencia Tecnológica<br />
              Av. Eugenio Garza Sada #427, CP 64849<br />
              Monterrey, Nuevo León.
            </p>
            <div className="mt-4">
              <ImagePlaceholder label="Mapa o foto de la ubicación" aspect="square" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-senso-teal-dark">
              <Mail className="h-5 w-5" />
              <h3 className="text-lg font-extrabold text-senso-navy">Contacto</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-senso-ink/70">
              Si deseas una cotización o información adicional de nuestros servicios, escríbenos a{" "}
              <a href="mailto:contacto@sensolab.mx" className="font-semibold text-senso-teal-dark underline">
                contacto@sensolab.mx
              </a>{" "}
              y te contactaremos a la brevedad posible.
            </p>
          </div>
        </div>
        <div className="border-t border-senso-teal/10 px-5 py-5 text-center text-xs text-senso-ink/50">
          Copyright © SensoLab Solutions 2016 — Sensory Passport es un pretotipo funcional construido sobre esta base.
          <span className="mx-2">·</span>
          <button type="button" onClick={onGoToAdminLogin} className="underline hover:text-senso-ink/70">
            Acceso de personal SensoLab
          </button>
        </div>
      </footer>
    </div>
  );
}
