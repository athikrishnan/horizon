export interface InvoiceDoc {
  id: string;
  code: string;
  customer: any;
  items: any[];
  hasDiscount: boolean;
  discount?: number;
  discountAmount?: number;
  subTotal: number;
  total: number;
  payments: any[];
  received: number;
  balance: number;
  totalCgst: number;
  totalSgst: number;
  createdAt: number;
  updatedAt: number;
  completedAt: number;
}
