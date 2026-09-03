import { useState } from "react";
import { motion } from "motion/react";
import { QrCode } from "lucide-react";

interface CheckInPanelProps {
  busy: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
}

export default function CheckInPanel({ busy, onClose, onSubmit }: CheckInPanelProps) {
  const [code, setCode] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(code);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-senso-ink/40 p-3 sm:items-center sm:p-6" role="presentation">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="w-full max-w-lg rounded-3xl border border-senso-teal/15 bg-white p-6 shadow-2xl sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="check-in-title"
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-senso-orange">Acción post-sesión</div>
            <h2 id="check-in-title" className="mt-2 text-2xl font-extrabold tracking-tight text-senso-navy">
              Actualiza tu pasaporte
            </h2>
          </div>
          <button type="button" onClick={onClose} className="text-xs font-semibold text-senso-ink/60 hover:text-senso-ink">
            Cerrar
          </button>
        </div>
        <p className="mt-5 text-sm leading-6 text-senso-ink/60">
          Ingresa el código breve que se muestra al final del estudio demo. En un servicio real podría escanearse desde un código QR.
        </p>
        <form className="mt-7" onSubmit={handleSubmit}>
          <label htmlFor="check-in-code" className="flex items-center gap-1.5 text-xs font-semibold text-senso-ink/70">
            <QrCode className="h-3.5 w-3.5" /> Código del estudio
          </label>
          <input
            id="check-in-code"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="SENSO-042"
            autoComplete="off"
            className="mt-2 w-full rounded-xl border border-senso-teal/25 bg-senso-cream px-3 py-3 text-sm outline-none transition focus:border-senso-teal"
          />
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-senso-teal/25 px-4 py-3 text-sm font-semibold text-senso-ink/60 hover:border-senso-teal hover:text-senso-ink"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!code.trim() || busy}
              className="rounded-xl bg-senso-orange px-4 py-3 text-sm font-bold text-white shadow-md shadow-senso-teal/30 transition hover:bg-senso-orange-dark disabled:cursor-not-allowed disabled:bg-senso-ink/15 disabled:text-senso-ink/60 disabled:shadow-none"
            >
              {busy ? "Actualizando..." : "Actualizar pasaporte"}
            </button>
          </div>
        </form>
        <div className="mt-6 rounded-xl border border-dashed border-senso-teal/25 bg-senso-teal/5 px-4 py-3 text-[11px] leading-5 text-senso-ink/60">
          Código demo: <code className="font-bold text-senso-teal-dark">SENSO-042</code>
        </div>
      </motion.div>
    </div>
  );
}
