import { Wallet, Receipt, PiggyBank, ListChecks } from "lucide-react";
import { brl } from "@/lib/format";

interface Props {
  budget: number;
  total: number;
  itemsCount: number;
}

export function BudgetCard({ budget, total, itemsCount }: Props) {
  const remaining = budget - total;
  const over = remaining < 0;
  return (
    <div className="grid grid-cols-2 gap-2">
      <Cell icon={<Wallet className="h-4 w-4" />} label="Orçamento" value={brl(budget)} />
      <Cell icon={<Receipt className="h-4 w-4" />} label="Total atual" value={brl(total)} />
      <Cell
        icon={<PiggyBank className="h-4 w-4" />}
        label={over ? "Excedido" : "Restante"}
        value={brl(Math.abs(remaining))}
        accent={over ? "danger" : "success"}
      />
      <Cell icon={<ListChecks className="h-4 w-4" />} label="Itens" value={String(itemsCount)} />
    </div>
  );
}

function Cell({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: "success" | "danger";
}) {
  const color =
    accent === "danger"
      ? "text-[var(--danger)]"
      : accent === "success"
        ? "text-[var(--success)]"
        : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className={`mt-1 text-lg font-semibold tabular-nums ${color}`}>{value}</div>
    </div>
  );
}