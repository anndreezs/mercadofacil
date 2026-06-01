import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, History, Receipt, ArrowRight, Wallet, ShoppingBasket } from "lucide-react";
import { brl, formatDate, padPurchaseNumber, parseBrlInput } from "@/lib/format";
import { purchaseTotal, usePurchaseStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mercado Fácil — Controle de compras em tempo real" },
      {
        name: "description",
        content: "Acompanhe seu orçamento durante as compras no supermercado.",
      },
      { property: "og:title", content: "Mercado Fácil" },
      { property: "og:description", content: "Controle suas compras em tempo real." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const purchases = usePurchaseStore((s) => s.purchases);
  const startPurchase = usePurchaseStore((s) => s.startPurchase);

  const [open, setOpen] = useState(false);
  const [budgetRaw, setBudgetRaw] = useState("");
  const budget = parseBrlInput(budgetRaw);

  const recent = purchases.filter((p) => p.status === "finished").slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="mx-auto max-w-2xl px-4 pt-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/15 text-primary">
            <ShoppingBasket className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mercado Fácil</h1>
            <p className="text-sm text-muted-foreground">
              Controle suas compras em tempo real.
            </p>
          </div>
        </div>

        <div className="mt-7 space-y-3">
          <button
            onClick={() => setOpen(true)}
            className="tap-press flex w-full items-center justify-between rounded-2xl bg-primary px-5 py-5 text-left text-primary-foreground shadow-lg shadow-primary/20"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6" />
              <div>
                <p className="text-base font-semibold">Nova Compra</p>
                <p className="text-xs opacity-80">Defina um orçamento e comece</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5" />
          </button>

          <Link
            to="/historico"
            className="tap-press flex w-full items-center justify-between rounded-2xl border border-border bg-card px-5 py-5"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-foreground">
                <History className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-semibold">Histórico</p>
                <p className="text-xs text-muted-foreground">
                  Veja compras anteriores
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        </div>

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Últimas compras
            </h2>
            <Link
              to="/historico"
              className="text-xs font-medium text-primary"
            >
              Ver tudo
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
              Nenhuma compra ainda
            </p>
          ) : (
            <ul className="space-y-2">
              {recent.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/comanda/$id"
                    params={{ id: p.id }}
                    className="tap-press flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
                      <Receipt className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">
                        Compra #{padPurchaseNumber(p.number)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(p.createdAt)} · {p.items.length} itens
                      </p>
                    </div>
                    <p className="font-semibold tabular-nums">
                      {brl(purchaseTotal(p))}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-fade-in w-full max-w-md rounded-t-2xl border border-border bg-card p-5 sm:rounded-2xl"
          >
            <div className="mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Definir orçamento</h3>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
              Quanto você pretende gastar nesta compra?
            </p>
            <input
              autoFocus
              value={budgetRaw ? brl(budget) : ""}
              onChange={(e) => setBudgetRaw(e.target.value)}
              inputMode="numeric"
              placeholder="R$ 0,00"
              className="w-full rounded-xl border border-border bg-background px-4 py-4 text-xl font-semibold outline-none focus:border-primary tabular-nums"
            />
            <button
              disabled={!budget}
              onClick={() => {
                const id = startPurchase(budget);
                setOpen(false);
                setBudgetRaw("");
                navigate({ to: "/compra/$id", params: { id } });
              }}
              className="tap-press mt-4 w-full rounded-xl bg-primary px-4 py-3.5 font-semibold text-primary-foreground disabled:opacity-50"
            >
              Começar compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
