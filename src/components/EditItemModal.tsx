import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { PurchaseItem } from "@/lib/types";
import { brl, parseBrlInput } from "@/lib/format";

interface Props {
  item: PurchaseItem | null;
  onClose: () => void;
  onSave: (data: { name: string; quantity: number; unitPrice: number }) => void;
}

export function EditItemModal({ item, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("1");
  const [priceRaw, setPriceRaw] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQty(String(item.quantity));
      setPriceRaw(String(Math.round(item.unitPrice * 100)));
    }
  }, [item]);

  if (!item) return null;
  const price = parseBrlInput(priceRaw);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in w-full max-w-md rounded-t-2xl border border-border bg-card p-5 sm:rounded-2xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Editar item</h3>
          <button
            onClick={onClose}
            className="tap-press grid h-8 w-8 place-items-center rounded-full text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Produto"
            className="w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-primary"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={qty}
              onChange={(e) => setQty(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              placeholder="Qtd"
              className="w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-primary tabular-nums"
            />
            <input
              value={priceRaw ? brl(price) : ""}
              onChange={(e) => setPriceRaw(e.target.value)}
              inputMode="numeric"
              placeholder="R$ 0,00"
              className="w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-primary tabular-nums"
            />
          </div>
          <button
            onClick={() => {
              if (!name.trim() || !price) return;
              onSave({
                name: name.trim(),
                quantity: Math.max(1, parseInt(qty || "1", 10)),
                unitPrice: price,
              });
            }}
            className="tap-press w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground"
          >
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
}