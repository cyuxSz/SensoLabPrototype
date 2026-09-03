interface CircleIllustrationProps {
  circleName: string;
  className?: string;
}

/**
 * A small hand-drawn-style inline SVG illustration per known circle, so each
 * circle has its own visual identity instead of a generic icon. Circles
 * created later by an admin (unknown name) fall back to a generic abstract
 * illustration that still fits the brand palette.
 */
export default function CircleIllustration({ circleName, className = "h-24 w-24" }: CircleIllustrationProps) {
  if (circleName === "Catadores Veganos") {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#ffffff" fillOpacity="0.12" />
        <path d="M50 78C50 78 26 64 26 42C26 30 35 22 45 26C48 27 50 30 50 30C50 30 52 27 55 26C65 22 74 30 74 42C74 64 50 78 50 78Z" fill="#26A69A" fillOpacity="0.9" />
        <path d="M50 30V70" stroke="#106870" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M50 45C50 45 42 40 36 44" stroke="#106870" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M50 58C50 58 58 53 64 57" stroke="#106870" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="30" cy="26" r="6" fill="#F68D35" />
        <circle cx="70" cy="24" r="4.5" fill="#F68D35" fillOpacity="0.8" />
      </svg>
    );
  }

  if (circleName === "Círculo de Fragancias y Cuidado") {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#ffffff" fillOpacity="0.12" />
        <rect x="38" y="42" width="24" height="34" rx="6" fill="#F68D35" fillOpacity="0.9" />
        <rect x="43" y="30" width="14" height="14" rx="3" fill="#26A69A" />
        <rect x="46" y="22" width="8" height="10" rx="2" fill="#106870" />
        <path d="M30 55C27 60 27 66 30 70" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
        <path d="M25 50C20 58 20 68 25 76" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
        <path d="M70 55C73 60 73 66 70 70" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (circleName === "Descubridores Cotidianos") {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#ffffff" fillOpacity="0.12" />
        <circle cx="50" cy="50" r="26" stroke="#F68D35" strokeWidth="3" />
        <path d="M50 50L60 36L46 44L36 60L50 50Z" fill="#26A69A" />
        <circle cx="50" cy="50" r="3.5" fill="#ffffff" />
        <circle cx="50" cy="18" r="2.5" fill="#ffffff" fillOpacity="0.6" />
        <circle cx="82" cy="50" r="2.5" fill="#ffffff" fillOpacity="0.6" />
        <circle cx="50" cy="82" r="2.5" fill="#ffffff" fillOpacity="0.6" />
        <circle cx="18" cy="50" r="2.5" fill="#ffffff" fillOpacity="0.6" />
      </svg>
    );
  }

  // Generic fallback for any circle created later by an admin.
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#ffffff" fillOpacity="0.12" />
      <circle cx="50" cy="50" r="22" fill="#F68D35" fillOpacity="0.85" />
      <circle cx="50" cy="50" r="12" fill="#26A69A" />
      <circle cx="50" cy="50" r="4" fill="#ffffff" />
    </svg>
  );
}
