import { useState } from "react";
import { Plus } from "lucide-react";
import { brl, parseBrlInput } from "@/lib/format";

interface Props {
  onAdd: (item: { name: string; quantity: number; unitPrice: number }) => void;
}

export function PurchaseForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("1");
  const [priceRaw, setPriceRaw] = useState("");
  const [error, setError] = useState<string | null>(null);

  const price = parseBrlInput(priceRaw);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const quantity = Math.max(1, parseInt(qty || "1", 10));
    if (!name.trim()) return setError("Informe o nome do produto");
    if (!price) return setError("Informe o preço");
    onAdd({ name: name.trim(), quantity, unitPrice: price });
    setName("");
    setQty("1");
    setPriceRaw("");
    setError(null);
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-border bg-card p-4 space-y-3"
    >
      <div className="space-y-1.5">
        <label className="text-xs uppercase tracking-wide text-muted-foreground">
          Produto
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex.: Arroz 5kg"
          className="w-full rounded-xl border border-border bg-background px-3 py-3 text-base outline-none focus:border-primary"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wide text-muted-foreground">
            Quantidade
          </label>
          <input
            value={qty}
            onChange={(e) => setQty(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            placeholder="1"
            className="w-full rounded-xl border border-border bg-background px-3 py-3 text-base outline-none focus:border-primary tabular-nums"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wide text-muted-foreground">
            Preço unitário
          </label>
          <input
            value={priceRaw ? brl(price) : ""}
            onChange={(e) => setPriceRaw(e.target.value)}
            inputMode="numeric"
            placeholder="R$ 0,00"
            className="w-full rounded-xl border border-border bg-background px-3 py-3 text-base outline-none focus:border-primary tabular-nums"
          />
        </div>
      </div>
      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
      <button
        type="submit"
        className="tap-press inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-base font-semibold text-primary-foreground"
      >
        <Plus className="h-5 w-5" />
        Adicionar Item
      </button>
    </form>
  );
}