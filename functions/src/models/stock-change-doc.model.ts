export interface StockChangeDoc {
  id: string;
  product: any;
  variant: any;
  quantity: number;
  isDebit: boolean;
  changedBy: any;
  updatedAt: number;
  createdAt: number;
}
