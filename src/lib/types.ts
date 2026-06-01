export interface PurchaseItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Purchase {
  id: string;
  number: number;
  budget: number;
  items: PurchaseItem[];
  status: "active" | "finished";
  createdAt: string;
  finishedAt?: string;
}