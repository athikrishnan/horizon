export interface PackDoc {
  id: string;
  name: string;
  quantity: number;
  price: number;
  contains: {
    isPack: boolean;
    id: string;
    name: string;
  };
  createdAt: number;
  updatedAt: number;
}
