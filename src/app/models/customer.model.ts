import { CustomerAddress } from './customer-address.model';

export interface Customer {
  id: string;
  name: string;
  code: number;
  address: CustomerAddress;
  phone: number;
  email: string;
  keywords: string[];
  discount?: number;
  createdAt: number;
  updatedAt: number;
}
