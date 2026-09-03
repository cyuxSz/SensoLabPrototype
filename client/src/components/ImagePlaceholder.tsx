import { ImageIcon } from "lucide-react";

interface ImagePlaceholderProps {
  label: string;
  aspect?: "video" | "square" | "wide";
  className?: string;
}

const ASPECT_CLASS: Record<string, string> = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
};

/**
 * A clearly-marked slot for a real photo to be added later. Used across the
 * public site so every section has a designated place for imagery without
 * blocking the build on real assets.
 */
export default function ImagePlaceholder({ label, aspect = "video", className = "" }: ImagePlaceholderProps) {
  return (
    <div
      className={`flex ${ASPECT_CLASS[aspect]} w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-senso-teal/30 bg-senso-teal/5 text-senso-teal-dark ${className}`}
    >
      <ImageIcon className="h-8 w-8 opacity-60" strokeWidth={1.5} />
      <span className="px-4 text-center text-xs font-semibold opacity-70">{label}</span>
    </div>
  );
}
