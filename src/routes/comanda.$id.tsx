import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { PurchaseItemRow } from "@/components/PurchaseItemRow";
import { purchaseItemCount, purchaseTotal, usePurchaseStore } from "@/lib/store";
import {
  brl,
  formatDateTime,
  padPurchaseNumber,
} from "@/lib/format";
import {
  CheckCircle2,
  Download,
  FileText,
  Home,
  Share2,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/comanda/$id")({
  head: () => ({
    meta: [
      { title: "Comanda — Mercado Fácil" },
      { name: "description", content: "Resumo final da sua compra." },
    ],
  }),
  component: ComandaPage,
});

function ComandaPage() {
  const { id } = Route.useParams();
  const purchase = usePurchaseStore((s) => s.purchases.find((p) => p.id === id));

  if (!purchase) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="Comanda não encontrada" back />
      </div>
    );
  }

  const total = purchaseTotal(purchase);
  const itemsCount = purchaseItemCount(purchase);
  const economy = Math.max(0, purchase.budget - total);
  const pct = purchase.budget > 0 ? (total / purchase.budget) * 100 : 0;
  const over = total > purchase.budget;

  return (
    <div className="min-h-screen bg-background pb-10">
      <AppHeader title="Comanda" back />

      <main className="mx-auto max-w-2xl space-y-4 px-4 py-4">
        <div className="rounded-2xl border border-border bg-card p-5 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--success)]/15 text-[var(--success)]">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Compra concluída</p>
          <h1 className="text-2xl font-bold tabular-nums">
            #{padPurchaseNumber(purchase.number)}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDateTime(purchase.finishedAt ?? purchase.createdAt)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Stat label="Orçamento" value={brl(purchase.budget)} />
          <Stat
            label="Total geral"
            value={brl(total)}
            accent={over ? "danger" : "foreground"}
          />
          <Stat
            label={over ? "Excedido" : "Economia"}
            value={brl(over ? total - purchase.budget : economy)}
            accent={over ? "danger" : "success"}
          />
          <Stat label="Itens" value={String(itemsCount)} />
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Utilizado</span>
            <span className="font-semibold tabular-nums">{pct.toFixed(0)}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, pct)}%`,
                backgroundColor: over
                  ? "var(--danger)"
                  : pct >= 80
                    ? "var(--warning)"
                    : "var(--success)",
              }}
            />
          </div>
        </div>

        <div>
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Produtos ({purchase.items.length})
          </h2>
          <ul className="space-y-2">
            {purchase.items.map((item, idx) => (
              <PurchaseItemRow key={item.id} item={item} index={idx} readonly />
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <Row label="Subtotal" value={brl(total)} />
          <Row label="Orçamento" value={brl(purchase.budget)} muted />
          <Row
            label={over ? "Excedido" : "Economia"}
            value={brl(over ? total - purchase.budget : economy)}
            accent={over ? "danger" : "success"}
          />
          <div className="my-2 h-px bg-border" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Geral</span>
            <span className="text-xl font-bold tabular-nums">{brl(total)}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <ActionButton icon={<FileText className="h-5 w-5" />} label="Visualizar" />
          <ActionButton icon={<Download className="h-5 w-5" />} label="Baixar PDF" />
          <ActionButton icon={<Share2 className="h-5 w-5" />} label="Compartilhar" />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <Link
            to="/"
            className="tap-press inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 font-medium"
          >
            <Home className="h-4 w-4" />
            Início
          </Link>
          <Link
            to="/historico"
            className="tap-press inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground"
          >
            <Sparkles className="h-4 w-4" />
            Histórico
          </Link>
        </div>
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "success" | "danger" | "foreground";
}) {
  const color =
    accent === "success"
      ? "text-[var(--success)]"
      : accent === "danger"
        ? "text-[var(--danger)]"
        : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={`mt-1 text-lg font-semibold tabular-nums ${color}`}>{value}</p>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
  muted,
}: {
  label: string;
  value: string;
  accent?: "success" | "danger";
  muted?: boolean;
}) {
  const color =
    accent === "success"
      ? "text-[var(--success)]"
      : accent === "danger"
        ? "text-[var(--danger)]"
        : muted
          ? "text-muted-foreground"
          : "text-foreground";
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold tabular-nums ${color}`}>{value}</span>
    </div>
  );
}

function ActionButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button className="tap-press flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card px-2 py-3 text-xs font-medium">
      <span className="text-primary">{icon}</span>
      {label}
    </button>
  );
}