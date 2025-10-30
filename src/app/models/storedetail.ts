import { Address } from "./address";
import { BusinessAccount } from "./businessaccount";

export class StoreDetail {
  id: number;
  description: string;
  name: string;
  website: string;
  accountNumber?: string;
  createdAt?: number;
  approvedAt?: number;
  archivedAt?: number;
  registeredAddress?: Address;
  storeAddress: Address;
  acceptOrderMethod: string;
  webHookUrl: string;
  businessAccount?: BusinessAccount;
  environment?: string;
}
