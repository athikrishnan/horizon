export interface PurchaseDoc {
  id: string;
  code: string;
  supplier: any;
  items: any[];
  createdAt: number;
  updatedAt: number;
  completedAt: number;
}
