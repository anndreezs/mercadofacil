import { Pencil, Trash2 } from "lucide-react";
import { brl } from "@/lib/format";
import type { PurchaseItem } from "@/lib/types";

interface Props {
  item: PurchaseItem;
  index: number;
  onEdit?: () => void;
  onDelete?: () => void;
  readonly?: boolean;
}

export function PurchaseItemRow({ item, index, onEdit, onDelete, readonly }: Props) {
  const subtotal = item.quantity * item.unitPrice;
  return (
    <li className="animate-fade-in rounded-xl border border-border bg-card p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-secondary text-[11px] font-semibold tabular-nums text-muted-foreground">
              {index + 1}
            </span>
            <p className="truncate font-medium">{item.name}</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground tabular-nums">
            {item.quantity} × {brl(item.unitPrice)} ={" "}
            <span className="font-semibold text-foreground">{brl(subtotal)}</span>
          </p>
        </div>
        {!readonly && (
          <div className="flex shrink-0 gap-1.5">
            <button
              onClick={onEdit}
              aria-label="Editar"
              className="tap-press grid h-9 w-9 place-items-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              aria-label="Excluir"
              className="tap-press grid h-9 w-9 place-items-center rounded-lg border border-border bg-background text-[var(--danger)]"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </li>
  );
}