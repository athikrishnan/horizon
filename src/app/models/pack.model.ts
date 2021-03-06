export interface Pack {
  id: string;
  supplier: {
    id: string,
    name: string
  };
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
