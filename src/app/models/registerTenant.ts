import { AccountCollaborator } from './accountCollaborator';
import { Address } from './address';
import { BankAccount } from './bankAccount';

export class RegisterTenant{
    legalName: string;
    companyNumber?: string;
    description?: string;
    registeredAddress: Address;
    bankAccount?: BankAccount;
    collaborators: AccountCollaborator[];
}
