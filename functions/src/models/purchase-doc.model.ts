export interface PurchaseDoc {
  id: string;
  code: string;
  supplier: {
    id: string;
    name: string;
    code: number;
    location: string;
    phone: string;
    email: string;
    keywords: string[];
    createdAt: number;
    updatedAt: number;
  };
  createdAt: number;
  updatedAt: number;
  completedAt: number;
}
