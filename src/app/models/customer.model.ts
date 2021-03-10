import { CustomerAddress } from './customer-addres.model';

export interface Customer {
  id: string;
  name: string;
  address: CustomerAddress;
  phone: number;
  email: string;
  createdAt: number;
  updatedAt: number;
}
