import { Purchase } from './purchase.model';
import { User } from './user.model';

export interface CompletedPurchase {
  id: string;
  purchase: Purchase;
  completedBy: User;
  createdAt: number;
  updatedAt: number;
}
