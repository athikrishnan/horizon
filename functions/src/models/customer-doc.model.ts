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
  account: {
    balance: number;
    received: number;
  }
  createdAt: number;
  updatedAt: number;
}
