import { User } from './user';

export class RegisterUser {
    createdAt: string;
    deviceToken: string;
    invitationCode: string;
    captchaToken: string;
    authId: string;
    userDetail: User;
}
