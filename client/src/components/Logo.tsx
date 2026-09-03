interface LogoProps {
  /** Height of the logo image itself. Width follows automatically to keep
   * the original file's proportions (it's a wide, rectangular lockup). */
  className?: string;
  /** Padding of the dark backing plate around the logo. */
  chipClassName?: string;
}

/**
 * SensoLab's ORIGINAL logo file, used exactly as provided
 * (client/public/logo_blanco.png — full lockup: icon + "SensoLab Solutions"
 * wordmark, unmodified pixels, same MD5 hash as the file you sent).
 *
 * The wordmark text in that file is WHITE, so it is only legible on a dark
 * background. This component always renders it on a solid dark backing
 * plate (senso-navy, i.e. near-black/charcoal) to guarantee contrast
 * wherever it's placed — never on a light/cream surface directly.
 */
export default function Logo({ className = "h-9 w-auto", chipClassName = "px-3 py-2" }: LogoProps) {
  return (
    <div className={`inline-flex items-center rounded-xl bg-senso-navy ${chipClassName}`}>
      <img src="/logo_blanco.png" alt="SensoLab Solutions" className={className} />
    </div>
  );
}
