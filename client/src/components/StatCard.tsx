interface StatCardProps {
  label: string;
  value: string;
  detail: string;
  accent?: "orange" | "teal";
}

export default function StatCard({ label, value, detail, accent = "teal" }: StatCardProps) {
  const accentClass = accent === "orange" ? "text-senso-orange" : "text-senso-teal-dark";
  return (
    <div className="rounded-2xl border border-senso-teal/15 bg-white p-5 shadow-sm shadow-senso-teal/5 transition hover:shadow-md hover:shadow-senso-teal/10">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-senso-ink/65">{label}</div>
      <div className={`mt-4 text-3xl font-extrabold tracking-tight ${accentClass}`}>{value}</div>
      <div className="mt-2 text-xs leading-5 text-senso-ink/65">{detail}</div>
    </div>
  );
}
