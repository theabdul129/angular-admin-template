import { Address } from './address';
import { BusinessAccount } from './businessaccount';

export class Store {
  id: number;
  description: string;
  name: string;
  accountNumber?: string;
  primaryPhone: string;
  createdAt?: number;
  registeredAddress: Address;
  storeAddress: Address;
  businessAccount?: BusinessAccount;
}
