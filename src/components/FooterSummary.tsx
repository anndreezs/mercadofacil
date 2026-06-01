import { Check } from "lucide-react";
import { brl } from "@/lib/format";

interface Props {
  itemsCount: number;
  total: number;
  onFinish: () => void;
  disabled?: boolean;
}

export function FooterSummary({ itemsCount, total, onFinish, disabled }: Props) {
  return (
    <div
      className="sticky bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {itemsCount} {itemsCount === 1 ? "item" : "itens"}
          </p>
          <p className="text-lg font-bold tabular-nums">{brl(total)}</p>
        </div>
        <button
          onClick={onFinish}
          disabled={disabled}
          className="tap-press inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-primary-foreground disabled:opacity-50"
        >
          <Check className="h-5 w-5" />
          Finalizar Compra
        </button>
      </div>
    </div>
  );
}