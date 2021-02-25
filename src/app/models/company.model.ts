import { CompanyAddress } from "./company-address.model";

export class Company {
  id: string;
  name: string;
  address: CompanyAddress;
  phone: number;
  email: string;
  pan: string;
  gstin: string;
  currency: string;
}