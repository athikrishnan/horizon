export interface ProformaDoc {
  id: string;
  code: string;
  customer: {
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
  };
  createdAt: number;
  updatedAt: number;
  completedAt: number;
}
