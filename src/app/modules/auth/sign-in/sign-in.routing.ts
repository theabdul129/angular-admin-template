import { Route } from '@angular/router';
import { AuthSignInComponent } from 'app/modules/auth/sign-in/sign-in.component';
import { AcceptInviteComponent } from '../accept-invite/accept-invite.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { ConfirmationRequiredComponent } from '../confirmation-required/confirmation-required.component';

export const authSignInRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full'
    },
    {
        path: 'sign-in',
        component: AuthSignInComponent
    },
    {
        path: 'sign-up',
        component: SignUpComponent
    },

    {
        path: 'confirmation-required',
        component: ConfirmationRequiredComponent
    },
    {
        path: 'invitation',
        component: AcceptInviteComponent
    }
];
