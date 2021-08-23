import { CustomerAccount } from './customer-account.model';
import { CustomerAddress } from './customer-address.model';

export interface Customer {
  id: string;
  name: string;
  code: number;
  address: CustomerAddress;
  storeName: string;
  gstin: string;
  phone: number;
  email: string;
  keywords: string[];
  discount?: number;
  account: CustomerAccount;
  createdAt: number;
  updatedAt: number;
}
