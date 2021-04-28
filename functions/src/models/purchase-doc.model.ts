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
  items: any[];
  createdAt: number;
  updatedAt: number;
  completedAt: number;
}
