import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { SearchBar } from "@/components/SearchBar";
import { HistoryList } from "@/components/HistoryList";
import { ConfirmModal } from "@/components/ConfirmModal";
import { usePurchaseStore } from "@/lib/store";
import { padPurchaseNumber, formatDate } from "@/lib/format";

export const Route = createFileRoute("/historico")({
  head: () => ({
    meta: [
      { title: "Histórico — Mercado Fácil" },
      { name: "description", content: "Veja suas compras anteriores agrupadas por mês." },
    ],
  }),
  component: HistoricoPage,
});

function HistoricoPage() {
  const purchases = usePurchaseStore((s) => s.purchases);
  const deletePurchase = usePurchaseStore((s) => s.deletePurchase);
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const finished = useMemo(
    () =>
      purchases
        .filter((p) => p.status === "finished")
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [purchases],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return finished;
    return finished.filter((p) => {
      if (padPurchaseNumber(p.number).includes(q)) return true;
      if (String(p.number).includes(q)) return true;
      if (formatDate(p.createdAt).toLowerCase().includes(q)) return true;
      if (p.items.some((i) => i.name.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [finished, query]);

  return (
    <div className="min-h-screen bg-background pb-10">
      <AppHeader title="Histórico" subtitle="Suas compras anteriores" back />
      <main className="mx-auto max-w-2xl space-y-4 px-4 py-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Buscar por número, data ou produto..."
        />
        <HistoryList
          purchases={filtered}
          onDelete={(id) => setDeletingId(id)}
        />
      </main>
      <ConfirmModal
        open={!!deletingId}
        title="Excluir compra?"
        description="Esta ação não poderá ser desfeita."
        confirmLabel="Excluir"
        destructive
        onConfirm={() => {
          if (deletingId) deletePurchase(deletingId);
        }}
        onClose={() => setDeletingId(null)}
      />
    </div>
  );
}