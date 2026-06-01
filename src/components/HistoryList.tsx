import { Link } from "@tanstack/react-router";
import { Eye, Trash2, Receipt } from "lucide-react";
import type { Purchase } from "@/lib/types";
import { brl, formatDate, monthKey, padPurchaseNumber } from "@/lib/format";
import { purchaseTotal } from "@/lib/store";

interface Props {
  purchases: Purchase[];
  onDelete: (id: string) => void;
}

export function HistoryList({ purchases, onDelete }: Props) {
  if (purchases.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center">
        <Receipt className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Nenhuma compra encontrada</p>
      </div>
    );
  }

  const groups = new Map<string, Purchase[]>();
  for (const p of purchases) {
    const k = monthKey(p.createdAt);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(p);
  }

  return (
    <div className="space-y-6">
      {Array.from(groups.entries()).map(([month, items]) => (
        <section key={month}>
          <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {month}
          </h3>
          <ul className="space-y-2">
            {items.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                  <Receipt className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">Compra #{padPurchaseNumber(p.number)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(p.createdAt)} · {p.items.length} itens
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold tabular-nums">{brl(purchaseTotal(p))}</p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <Link
                    to="/comanda/$id"
                    params={{ id: p.id }}
                    aria-label="Visualizar"
                    className="tap-press grid h-9 w-9 place-items-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => onDelete(p.id)}
                    aria-label="Excluir"
                    className="tap-press grid h-9 w-9 place-items-center rounded-lg border border-border bg-background text-[var(--danger)]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}