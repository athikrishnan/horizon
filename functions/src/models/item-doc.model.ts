export interface ItemDoc {
  id: string;
  supplier: {
    id: string;
    name: string;
  };
  name: string;
  quantity: string;
  price: string;
  createdAt: number;
  updatedAt: number;
}
