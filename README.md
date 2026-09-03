# SensoLab Sensory Passport

Sitio público de SensoLab Solutions + portal de miembro "Sensory Passport": registro
con cuestionario de perfil sensorial, sugerencia automática de círculo (base para
un futuro chatbot), racha de estudios (estilo Duolingo), niveles, insignias, retos
personales, chat de círculo, datos curiosos e invitaciones específicas por círculo.
Basado en los entregables de Creating Prototypes (Actividades 1-3 y Evidencia 1),
incluyendo los hallazgos de la encuesta de la Actividad 3, y en el contenido real
del sitio de SensoLab Solutions.

## Stack

- **Cliente:** React 18 + TypeScript + Vite + Tailwind CSS 4 + `motion` (animaciones)
  + `lucide-react` (iconos) + Google `<model-viewer>` (medallas 3D/AR opcionales)
- **Servidor:** Node.js + Express + TypeScript + Zod (validación)
- Todo el código está tipado en TypeScript; no hay JavaScript sin tipos.

## Flujo de la app

```
Página pública (landing)
  ├─ Iniciar sesión ──────────────► Portal (si las credenciales son válidas)
  └─ Crear cuenta
        ├─ Paso 1: datos generales (nombre, fecha de nacimiento, ciudad, correo, contraseña)
        ├─ Paso 2: cuestionario de perfil sensorial (categorías, dieta, picante, formato, frecuencia)
        └─ Descubre tu círculo (sugerencia por reglas) ──► Entrar a mi círculo ──► Portal
```

El **Portal** es la app de miembro ya existente: Resumen, Pasaporte, Sesiones,
Comunidad, Retos y Perfil, con "Cerrar sesión" disponible en la barra lateral y en
el encabezado móvil.

### Autenticación (demo funcional, cuentas independientes)

Es un pretotipo sin base de datos externa, pero el login es real y **cada cuenta
tiene su propio estado aislado** (perfil, estadísticas, insignias, historial,
retos) — crear una cuenta nueva **nunca** modifica ni corrompe otra cuenta
existente, incluida la cuenta demo. Todas las rutas de datos (`/api/dashboard`,
`/api/profile`, etc.) están protegidas y devuelven 401 si no has iniciado sesión.
Un correo ya registrado no se puede volver a usar para crear otra cuenta (409).

Cuenta demo ya sembrada, con historial de ejemplo, para probar sin registrarte:

```
correo:      alex@demo.com
contraseña:  senso2026
```

Si creas una cuenta nueva desde "Crear cuenta", se guarda como una cuenta
totalmente separada con su propio perfil desde cero (nombre, fecha de
nacimiento, ciudad, perfil sensorial) — la cuenta demo sigue intacta y
disponible para volver a iniciar sesión en cualquier momento.

### Descubre tu círculo (base para el futuro chatbot)

`suggestCircle()` en `server/src/data.ts` es un motor de reglas simple sobre tus
respuestas del cuestionario (dieta, categorías de interés):

- Dieta vegetariana/vegana → **Plant-Based Tasters**
- Interés en cosméticos/cuidado personal → **Fragrance & Care Circle**
- Interés en alimentos/bebidas (sin lo anterior) → **Plant-Based Tasters**
- Cualquier otra combinación → **Everyday Discoverers**

La salida (`{ name, description, matchReason, funFacts }`) tiene la misma forma
que necesitaría un chatbot conversacional futuro — reemplazar las reglas por una
llamada a IA es un cambio aislado a esa única función, sin tocar el resto de la app.
Hay un endpoint de solo-preview (`POST /api/onboarding/suggest-circle`) que no
requiere sesión, pensado para poder probar sugerencias antes de comprometerse a
una cuenta.

## Página pública (landing)

Reconstruida con el contenido real que compartiste: Quiénes somos, Misión,
los 3 servicios (Panel Entrenado, Estudios con Consumidores, Servicios
Adicionales) con sus metodologías, Participa, Ubicación y Contacto. Junto a la
información, hay una sección de portal con botones de "Iniciar sesión" y
"Crear cuenta".

**Fotos:** las 3 tarjetas de servicio usan tus fotos reales
(`client/public/images/panel-entrenado.jpg`, `estudios-consumidores.jpg`,
`servicios-adicionales.jpg` — verificadas con hash MD5 idéntico a los
archivos que enviaste, sin edición). Se **quitaron** los espacios de foto
del laboratorio/instalaciones, del equipo/panel entrenado, de misión/equipo
directivo y de participantes en sesión, porque no están disponibles o son
confidenciales. Solo queda el espacio para foto de Ubicación
(`ImagePlaceholder.tsx`), ya que esa no se marcó como confidencial.

## Paleta de marca

Colores deliberadamente distintos a los del logotipo original (`#F28F11` / `#1899A3`),
elegidos para mejor contraste de lectura:

| Uso | Color |
|---|---|
| Naranja de marca (UI) | `#F68D35` |
| Cian de marca (UI) | `#26A69A` |
| Azul marino (fondos oscuros, texto) | `#2C3E50` |
| Fondo cálido | `#FFF8EF` |

Los botones ya **no usan degradado** — son de color naranja sólido
(`bg-senso-orange`, con `hover:bg-senso-orange-dark`). El degradado se dejó
únicamente en las barras de progreso (no son botones).

### Dónde está el logotipo (para cambiarlo manualmente)

**El archivo:** `client/public/logo_blanco.png` — es el logo original completo
que nos diste, tal cual, sin recortar ni modificar (mismo hash MD5).

**El componente que lo muestra:** `client/src/components/Logo.tsx` — es el
único lugar del código que hace referencia al archivo del logo. Todas las
pantallas de la app importan y usan este mismo componente, así que:

- Para **cambiar el archivo del logo**: reemplaza `client/public/logo_blanco.png`
  por tu nuevo archivo (mismo nombre), o edita la línea `src="/logo_blanco.png"`
  dentro de `Logo.tsx` para apuntar a otro archivo que coloques en `client/public/`.
- Para **cambiar el color de la placa de fondo**: edita la clase `bg-senso-navy`
  dentro de ese mismo archivo (o pásale otra clase de Tailwind vía el prop
  `chipClassName`, que solo controla el padding por defecto).

Como el logo tiene el texto "SensoLab Solutions" en blanco, `Logo.tsx` lo monta
sobre una **placa oscura sólida** (`bg-senso-navy`, un gris azulado casi negro)
en todos los lugares donde aparece (barra lateral del portal, encabezado móvil,
login, registro, "descubre tu círculo", panel de administración, pantalla de
carga y el header del sitio público), para que el texto blanco siempre tenga
contraste, sin importar sobre qué fondo de página se coloque. El favicon del
navegador (`favicon.ico`) es un archivo aparte que usa un recorte del ícono,
porque un favicon totalmente blanco es invisible en la pestaña.

## Iconos modernos

Los emoji de la interfaz (🔥🏅🔒🤝💡🎯✨) se reemplazaron por iconos reales de
[`lucide-react`](https://lucide.dev) en la navegación, las insignias, los retos,
la comunidad, el módulo 3D y la racha animada.

## Racha de estudios (estilo Duolingo)

La racha cuenta **estudios consecutivos, no días del calendario**. Cada check-in
post-sesión (código demo `SENSO-042`) suma 1 a la racha, agrega una entrada al
pasaporte, avanza el nivel y actualiza automáticamente los retos relacionados.

## Retos (no competitivos)

Metas personales, nunca una tabla de posiciones — la encuesta de la Actividad 3
mostró que un Top 5 público no motiva tanto como recompensas concretas:

1. **Racha de 3 estudios seguidos** → acceso prioritario a la siguiente invitación
2. **Asiste a todos los estudios del año** → muestra de producto exclusiva + insignia
3. **Refiere a 5 personas** → bono de referido + lugar en sesión exclusiva
4. **Haz lo invisible describible** (nota sensorial mensual, manual) → reconocimiento como Curator

## Comunidad: círculos múltiples, canal de avisos, datos curiosos e invitaciones

- **Pertenencia a varios círculos a la vez** — ya no es un solo círculo por
  persona. Cada miembro puede unirse a 2-3 círculos según sus intereses
  (ej. vegano Y cosméticos), con pestañas para cambiar entre ellos en
  Comunidad. Sección "Descubre más círculos" para unirte a otros disponibles.
- **Canal de avisos por círculo (estilo canal de WhatsApp)** — ya no es un
  chat abierto: **solo el personal de SensoLab (desde el panel de admin)
  puede publicar avisos**; los miembros solo pueden **reaccionar** con un
  emoji (👍❤️😂😮🙌, uno por mensaje, toca de nuevo para quitarlo). Cada
  círculo tiene su propio canal.
- **Datos curiosos por círculo** — cada uno tiene los suyos, editables desde
  el panel de administración.
- **Invitación exclusiva por círculo** — distinta de las sesiones generales.
- **Ilustraciones propias por círculo** (`CircleIllustration.tsx`) — un SVG
  hecho a mano para cada círculo conocido, con una ilustración genérica de
  respaldo para los que cree un admin.
- Botón para simular un referido (alimenta el reto de referidos).

## Panel de administración (personal de SensoLab)

Acceso desde el pie de la página pública ("Acceso de personal SensoLab"),
separado por completo del login de miembros. Cuenta demo:

```
correo:      admin@sensolab.mx
contraseña:  admin2026
```

Tres pestañas, todas funcionales contra el servidor:

- **Círculos** — ve cuántas personas hay en cada círculo (en vivo, calculado
  de las cuentas reales), crea un círculo nuevo (nombre, descripción, datos
  curiosos, límite de miembros) sin tocar código, y crea invitaciones
  específicas para cualquier círculo desde un formulario.
- **Cuentas** — tabla de todas las cuentas registradas: nombre, correo,
  ciudad, círculos, nivel, estudios completados, referidos.
- **Moderación** — publica avisos en el canal de cualquier círculo (esta es
  ahora la única forma de "escribir" en un canal — los miembros solo
  reaccionan) y borra cualquier mensaje existente.

## Puntos y recompensas canjeables

Cada estudio y cada insignia suman puntos, que se pueden canjear por
beneficios reales en la sección **Recompensas**:

| Acción | Puntos |
|---|---|
| Completar un estudio (check-in) | +100 |
| Ganar una insignia | +200 |
| Racha llega a un múltiplo de 3 (3, 6, 9...) | +50 |
| Racha llega a un múltiplo de 5 (5, 10...) | +75 |
| Racha llega a un múltiplo de 10 (10, 20...) | +100 extra |

Por ejemplo, una racha perfecta de 10 estudios seguidos da 1000 puntos base
más 400 de bonos de racha (150 de los tres múltiplos de 3, 75 del múltiplo de
5, y 175 al llegar a 10) — 1400 puntos solo por la racha, verificado en vivo
contra el servidor.

La tienda (`RewardsShelf.tsx`) tiene 6 recompensas de ejemplo, en niveles de
costo pensados para que no sean ni muy baratas ni inalcanzables — desde
acceso prioritario (300 pts) hasta una sesión 1:1 con el equipo de
investigación (2,500 pts), pasando por convenios con aliados como "50% de
descuento en toda la página — Empresa X" (1,200 pts). Cada canje:

- Verifica puntos suficientes, cupos disponibles, y que no la hayas canjeado antes
- Genera un código único (ej. `SL-6TRQLH`)
- Dispara una animación de celebración con confetti y sonido (`RewardRedeemCelebration.tsx`)

## Celebración al desbloquear una insignia

Cuando ganas una insignia nueva (por check-in, reto, o referido), aparece un
modal con confetti animado y un pequeño acorde musical generado con Web Audio
(sin archivo de audio externo) — con botón para silenciarlo, guardado en
`localStorage`. Ver `BadgeUnlockCelebration.tsx`.

## Modo de visualización: Cómodo / Compacto

Preferencia editable en Perfil (`density`, guardada en el servidor). El modo
Compacto reduce espaciados y oculta texto secundario en Sesiones, Retos y el
historial del Pasaporte, para ver más información sin desplazarte.

## Medallas especiales en 3D/AR

El módulo 3D/AR muestra tus insignias como una **estantería** de medallas
coleccionables (obtenidas y bloqueadas), cada una con su propio modelo 3D
distinto: Astronauta (Explorador), Caballo (Catador), Robot (Curador), Neil
Armstrong (Rachero) y Cohete (Asistencia Perfecta). Elige cualquier insignia
ya obtenida para verla en 3D o AR.

## Requisitos

- Node.js 18 o superior (recomendado 20+)
- npm 9 o superior

## Deploy en Vercel

- Configurar el proyecto con **Root Directory = repositorio raíz** (donde viven `api/`, `client/` y `vercel.json`).
- El build de Vercel usa `npm run build` y publica `client/dist` como salida estática.
- Las rutas `api/**/*.ts` se despliegan como Serverless Functions de Vercel.
- La regla SPA en `vercel.json` solo reescribe rutas no-API a `index.html` para no interferir con `/api/*`.

## Cómo correrlo en tu PC (local)

Desde la carpeta raíz `sensolab-passport/`:

```bash
npm install
npm run dev
```

- **Cliente:** http://localhost:5173
- **API:** http://localhost:3001/api/health

El proxy de Vite (`vite.config.ts`) ya redirige `/api/*` a `http://localhost:3001`,
así que no necesitas variables de entorno adicionales para el modo demo.

### Comandos disponibles (desde la raíz)

| Comando | Qué hace |
|---|---|
| `npm install` | Instala dependencias de cliente y servidor (workspaces) |
| `npm run dev` | Corre cliente + servidor juntos con recarga en caliente |
| `npm run build` | Compila servidor (`tsc`) y cliente (`vite build`) para producción |
| `npm run typecheck` | Verifica tipos de TypeScript en ambos proyectos |

También puedes correr cada parte por separado:

```bash
# Terminal 1
cd server && npm install && npm run dev

# Terminal 2
cd client && npm install && npm run dev
```

## Interacciones de la demo

1. En la página pública, revisa el contenido y presiona **Crear cuenta**.
2. Completa el paso 1 (datos generales) y el paso 2 (perfil sensorial).
3. En **Descubre tu círculo**, revisa la sugerencia y presiona **Entrar a mi círculo**.
4. Ya en el portal: reserva una sesión, haz check-in con `SENSO-042` varias veces
   (verás el modal de celebración con confetti al desbloquear cada insignia,
   crecer la racha, subir de nivel y avanzar retos).
5. Ve a **Comunidad**: escribe en el chat, revisa los datos curiosos, confirma
   la invitación exclusiva, simula un referido, y en "Descubre más círculos"
   únete a un segundo círculo — verás pestañas para cambiar entre ambos.
6. Ve a **Retos** para ver tus metas personales, y a **Perfil** para editar tus
   datos y probar el modo de visualización Compacto.
7. Presiona el botón **"Página principal de SensoLab"** en la barra lateral
   para volver al sitio público sin cerrar sesión — verás "Ir a mi portal"
   en vez de los botones de login/registro.
8. Presiona **Cerrar sesión** y vuelve a entrar con `alex@demo.com` / `senso2026`.
9. Desde el pie de la página pública, entra a **"Acceso de personal SensoLab"**
   (`admin@sensolab.mx` / `admin2026`) para probar el panel de administración:
   crea un círculo nuevo, crea una invitación para él, y modera el chat de
   "Catadores Veganos" borrando un mensaje.

## Modelo 3D/AR

El modelo por defecto es el astronauta de muestra oficial de `<model-viewer>`,
usado como marcador de posición para cada medalla. Para reemplazarlo, crea un
archivo `.env` dentro de `client/` con:

```
VITE_MODEL_VIEWER_SRC=https://tu-dominio.com/medalla-aprobada.glb
```

## Estructura del proyecto

```
sensolab-passport/
├── package.json              # workspace raíz (orquesta client + server)
├── server/                   # API Express + TypeScript
│   └── src/
│       ├── index.ts          # rutas HTTP (member + admin + onboarding)
│       ├── data.ts           # estado en memoria: cuentas, catálogo de círculos, admin...
│       └── types.ts
└── client/                   # React + TypeScript + Vite
    ├── public/
    │   ├── logo_blanco.png       # logo original, sin modificar
    │   ├── logo-icon.png         # recorte del ícono, sin texto
    │   ├── favicon.ico           # ícono recortado sobre placa de color
    │   └── images/                # fotos reales de servicios
    └── src/
        ├── App.tsx                # máquina de estados: landing/login/signup/portal/admin
        ├── api.ts
        ├── types.ts
        ├── index.css              # tema de marca SensoLab (Tailwind v4)
        └── components/
            ├── LandingPage.tsx        # sitio público con contenido real
            ├── LoginForm.tsx
            ├── SignupWizard.tsx       # registro + cuestionario sensorial
            ├── DiscoverCircle.tsx     # sugerencia de círculo
            ├── AdminLogin.tsx         # login de personal (separado del de miembros)
            ├── AdminDashboard.tsx     # círculos / cuentas / moderación
            ├── ImagePlaceholder.tsx   # espacios de foto reutilizables
            ├── CircleIllustration.tsx # SVG propio por círculo
            ├── BadgeUnlockCelebration.tsx # confetti + sonido al desbloquear insignia
            ├── AppShell.tsx           # navegación del portal (iconos lucide-react)
            ├── Logo.tsx
            ├── StreakFlame.tsx
            ├── ProgressBar.tsx
            ├── StatCard.tsx
            ├── Overview.tsx
            ├── Passport.tsx
            ├── Sessions.tsx
            ├── Community.tsx          # círculos múltiples, chat, datos curiosos
            ├── Challenges.tsx
            ├── Profile.tsx            # incluye modo Cómodo/Compacto
            ├── CheckInPanel.tsx
            ├── ARPreview.tsx          # estantería de medallas 3D
            └── ErrorBoundary.tsx
```

## Alcance deliberado (fuera de este pretotipo)

- Autenticación de producción (hash de contraseñas, tokens, múltiples usuarios reales)
- Base de datos de producción (todo vive en memoria del servidor)
- El chatbot conversacional para sugerir círculo (hoy es un motor de reglas)
- Pagos reales (SPEI/Dimo/CoDi solo se mencionan como hallazgo de investigación)
- Escaneo de QR real (se simula con un código de texto)
- Seguimiento biométrico
- Modelos 3D de producción por insignia (se usa un modelo de muestra)
- Fotos reales del sitio (se dejaron espacios marcados listos para agregarlas)
