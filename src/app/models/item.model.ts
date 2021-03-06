export interface Item {
  id: string;
  supplier: {
    id: string;
    name: string;
  };
  name: string;
  quantity: number;
  price: number;
  createdAt: number;
  updatedAt: number;
}
