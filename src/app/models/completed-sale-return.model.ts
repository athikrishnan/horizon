import { SaleReturn } from './sale-return.model';
import { User } from './user.model';

export interface CompletedSaleReturn {
  id: string;
  saleReturn: SaleReturn;
  completedBy: User;
  createdAt: number;
  updatedAt: number;
}
