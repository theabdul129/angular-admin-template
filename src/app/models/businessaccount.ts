import { Address } from './address';


export class BusinessAccount {
    id: number;
    accountNumber?: number;
    legalName?: string;
    description?: string;
    website?: string;
    createdAt?: number;
    archivedAt?: number;
    approvedAt?: number;
    declinedAt?: number;
    payoutAccountId?: string;
    submittedAt?: number;
    vatId?: string;
    companyNumber?: string;
    registeredAddress?: Address;
    }
