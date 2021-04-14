import { CreatedBy } from './created-by.nodel';

export interface Expense {
  id: string;
  type: string;
  amount: number;
  date: string;
  createdBy: CreatedBy;
  createdAt: number;
  updatedAt: number;
}
