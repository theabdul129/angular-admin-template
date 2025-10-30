import { User } from "./user";
import { BasicNameValuePair } from "./basicnamevaluepair";

export class StoreCollaborator {
  id?: number;
  jobTitle?: string;
  ownership?: number;
  businessPosition?: string;
  userProfile: User;
  acceptedAt: Date;
  declinedAt: Date;
  archived: any;
  storePrivileges: [BasicNameValuePair];
}
