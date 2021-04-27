export interface InvoiceItemDoc {
  id: string;
  product: any;
  variant: any;
  pack: any;
  price: number;
  quantity: number;
  cgst: number;
  sgst: number;
  createdAt: number;
  updatedAt: number;
}