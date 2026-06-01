import { AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";

interface Props {
  budget: number;
  total: number;
}

export function ProgressCard({ budget, total }: Props) {
  const pct = budget > 0 ? (total / budget) * 100 : 0;
  const clamped = Math.min(100, pct);

  let status: "ok" | "warn" | "over" = "ok";
  if (pct > 100) status = "over";
  else if (pct >= 80) status = "warn";

  const map = {
    ok: {
      color: "var(--success)",
      label: "Dentro do orçamento",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    warn: {
      color: "var(--warning)",
      label: "Atenção ao orçamento",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    over: {
      color: "var(--danger)",
      label: "Orçamento ultrapassado",
      icon: <TrendingUp className="h-4 w-4" />,
    },
  }[status];

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between text-sm">
        <span
          className="inline-flex items-center gap-1.5 font-medium"
          style={{ color: map.color }}
        >
          {map.icon}
          {map.label}
        </span>
        <span className="tabular-nums text-muted-foreground">
          {pct.toFixed(0)}%
        </span>
      </div>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${clamped}%`, backgroundColor: map.color }}
        />
      </div>
    </div>
  );
}