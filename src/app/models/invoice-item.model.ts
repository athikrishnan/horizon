export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  size: number;
  variantPrice: number;
  price: number;
  quantity: number;
  createdAt: number;
  updatedAt: number;
}
