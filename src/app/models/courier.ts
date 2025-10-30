import { User } from './user';

export class Courier {
  id?: number;
  userDetail: User;
  jobAllocationStrategy: string;
  lastKnownLocation?;
  approvedAt?: number;
  archivedAt?: number;
  acceptingOrders?: boolean;
  hourlyPaymentSchedule?: boolean;
  commuteProfile?: string;
  catchmentArea?: any;
}
