export interface CustomerDoc {
  id: string;
  name: string;
  code: number;
  address: {
    street: string;
    locality: string;
    city: string;
    state: string;
    zip: string;
  };
  phone: number;
  email: string;
  keywords: string[];
  createdAt: number;
  updatedAt: number;
}
