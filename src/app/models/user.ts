import { Address } from './address';
import { BasicNameValuePair } from './basicnamevaluepair';

export class User {
  id?: number;
  primaryPhone?: string;
  emailAddress: string;
  firstName: string;
  surname: string;
  password?: string;
  token?: string;
  homeAddress?: Address;
  zoneId: string;
  accountNumber?: string;
  roles?: [BasicNameValuePair];
  acceptingOrders?: boolean;
  hourlyPaymentSchedule?: boolean;
  commuteProfile?: string;
}
