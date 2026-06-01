import { create } from "zustand";
import type { Purchase, PurchaseItem } from "./types";
import { mockPurchases } from "./mock-data";

interface State {
  purchases: Purchase[];
  activeId: string | null;

  startPurchase: (budget: number) => string;
  addItem: (purchaseId: string, item: Omit<PurchaseItem, "id">) => void;
  updateItem: (purchaseId: string, itemId: string, item: Omit<PurchaseItem, "id">) => void;
  removeItem: (purchaseId: string, itemId: string) => void;
  finishPurchase: (purchaseId: string) => void;
  deletePurchase: (purchaseId: string) => void;
  getPurchase: (id: string) => Purchase | undefined;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const usePurchaseStore = create<State>((set, get) => ({
  purchases: mockPurchases,
  activeId: null,

  startPurchase: (budget) => {
    const id = uid();
    const nextNumber =
      Math.max(0, ...get().purchases.map((p) => p.number)) + 1;
    const purchase: Purchase = {
      id,
      number: nextNumber,
      budget,
      items: [],
      status: "active",
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ purchases: [purchase, ...s.purchases], activeId: id }));
    return id;
  },

  addItem: (purchaseId, item) =>
    set((s) => ({
      purchases: s.purchases.map((p) =>
        p.id === purchaseId
          ? { ...p, items: [...p.items, { ...item, id: uid() }] }
          : p,
      ),
    })),

  updateItem: (purchaseId, itemId, item) =>
    set((s) => ({
      purchases: s.purchases.map((p) =>
        p.id === purchaseId
          ? {
              ...p,
              items: p.items.map((i) =>
                i.id === itemId ? { ...i, ...item } : i,
              ),
            }
          : p,
      ),
    })),

  removeItem: (purchaseId, itemId) =>
    set((s) => ({
      purchases: s.purchases.map((p) =>
        p.id === purchaseId
          ? { ...p, items: p.items.filter((i) => i.id !== itemId) }
          : p,
      ),
    })),

  finishPurchase: (purchaseId) =>
    set((s) => ({
      activeId: null,
      purchases: s.purchases.map((p) =>
        p.id === purchaseId
          ? { ...p, status: "finished", finishedAt: new Date().toISOString() }
          : p,
      ),
    })),

  deletePurchase: (purchaseId) =>
    set((s) => ({
      purchases: s.purchases.filter((p) => p.id !== purchaseId),
    })),

  getPurchase: (id) => get().purchases.find((p) => p.id === id),
}));

export const purchaseTotal = (p: Purchase) =>
  p.items.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0);

export const purchaseItemCount = (p: Purchase) =>
  p.items.reduce((acc, i) => acc + i.quantity, 0);