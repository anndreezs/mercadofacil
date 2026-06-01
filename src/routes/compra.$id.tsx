import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { BudgetCard } from "@/components/BudgetCard";
import { ProgressCard } from "@/components/ProgressCard";
import { PurchaseForm } from "@/components/PurchaseForm";
import { PurchaseItemRow } from "@/components/PurchaseItemRow";
import { FooterSummary } from "@/components/FooterSummary";
import { EditItemModal } from "@/components/EditItemModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import {
  purchaseItemCount,
  purchaseTotal,
  usePurchaseStore,
} from "@/lib/store";
import type { PurchaseItem } from "@/lib/types";
import { padPurchaseNumber } from "@/lib/format";
import { ShoppingCart } from "lucide-react";

export const Route = createFileRoute("/compra/$id")({
  head: () => ({
    meta: [
      { title: "Compra em andamento — Mercado Fácil" },
      { name: "description", content: "Adicione itens e acompanhe seu orçamento." },
    ],
  }),
  component: ComprePage,
});

function ComprePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const purchase = usePurchaseStore((s) => s.purchases.find((p) => p.id === id));
  const addItem = usePurchaseStore((s) => s.addItem);
  const updateItem = usePurchaseStore((s) => s.updateItem);
  const removeItem = usePurchaseStore((s) => s.removeItem);
  const finishPurchase = usePurchaseStore((s) => s.finishPurchase);

  const [editing, setEditing] = useState<PurchaseItem | null>(null);
  const [deleting, setDeleting] = useState<PurchaseItem | null>(null);
  const [confirmFinish, setConfirmFinish] = useState(false);

  if (!purchase) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="Compra não encontrada" back />
        <div className="p-6 text-center text-muted-foreground">
          Esta compra não existe.
        </div>
      </div>
    );
  }

  const total = purchaseTotal(purchase);
  const itemsCount = purchaseItemCount(purchase);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader
        title={`Compra #${padPurchaseNumber(purchase.number)}`}
        subtitle="Em andamento"
        back
      />

      <main className="mx-auto w-full max-w-2xl flex-1 space-y-4 px-4 py-4">
        <BudgetCard
          budget={purchase.budget}
          total={total}
          itemsCount={itemsCount}
        />
        <ProgressCard budget={purchase.budget} total={total} />
        <PurchaseForm onAdd={(item) => addItem(purchase.id, item)} />

        <div>
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Itens adicionados
          </h2>
          {purchase.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center">
              <ShoppingCart className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Nenhum item ainda. Adicione o primeiro acima.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {purchase.items.map((item, idx) => (
                <PurchaseItemRow
                  key={item.id}
                  item={item}
                  index={idx}
                  onEdit={() => setEditing(item)}
                  onDelete={() => setDeleting(item)}
                />
              ))}
            </ul>
          )}
        </div>
      </main>

      <FooterSummary
        itemsCount={itemsCount}
        total={total}
        disabled={purchase.items.length === 0}
        onFinish={() => setConfirmFinish(true)}
      />

      <EditItemModal
        item={editing}
        onClose={() => setEditing(null)}
        onSave={(data) => {
          if (editing) updateItem(purchase.id, editing.id, data);
          setEditing(null);
        }}
      />

      <ConfirmModal
        open={!!deleting}
        title="Excluir item?"
        description={deleting ? `Remover "${deleting.name}" da lista?` : ""}
        confirmLabel="Excluir"
        destructive
        onConfirm={() => {
          if (deleting) removeItem(purchase.id, deleting.id);
        }}
        onClose={() => setDeleting(null)}
      />

      <ConfirmModal
        open={confirmFinish}
        title="Finalizar compra?"
        description="Gerar a comanda final desta compra?"
        confirmLabel="Finalizar"
        onConfirm={() => {
          finishPurchase(purchase.id);
          navigate({ to: "/comanda/$id", params: { id: purchase.id } });
        }}
        onClose={() => setConfirmFinish(false)}
      />
    </div>
  );
}