import { IncomeType } from '../enums/income-type.enum';
import { User } from './user.model';

export interface Income {
  id: string;
  type: IncomeType;
  other?: string;
  amount: number;
  date: any;
  comments?: string;
  createdBy: User;
  createdAt: number;
  updatedAt: number;
}
