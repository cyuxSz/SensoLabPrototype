import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches rendering errors anywhere in the tree and shows a readable message
 * instead of leaving the user with a blank white page.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("SensoLab Sensory Passport crashed:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-senso-cream p-6">
          <div className="w-full max-w-md rounded-3xl border border-senso-orange/30 bg-white p-7 shadow-xl">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-senso-orange">
              SensoLab / Sensory Passport
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-senso-navy">
              Algo salió mal
            </h1>
            <p className="mt-4 text-sm leading-6 text-senso-ink/60">
              Ocurrió un error inesperado en la interfaz. Abre la consola del navegador (F12) para
              ver el detalle técnico, o recarga la página.
            </p>
            <p className="mt-3 rounded-xl bg-senso-ink/5 p-3 font-mono text-xs text-senso-ink/70">
              {this.state.error.message}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 w-full rounded-xl bg-senso-orange px-4 py-3 text-sm font-bold text-white"
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
