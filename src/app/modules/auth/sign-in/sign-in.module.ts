import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
// import { FuseCardModule } from '@fuse/components/card';
// import { FuseAlertModule } from '@fuse/components/alert';
import { AuthSignInComponent } from 'app/modules/auth/sign-in/sign-in.component';
import { authSignInRoutes } from 'app/modules/auth/sign-in/sign-in.routing';
import { CommonModule } from '@angular/common';
import { AcceptInviteComponent } from '../accept-invite/accept-invite.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatStepperModule} from '@angular/material/stepper';
import { SharedModule } from 'app/shared/shared.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [
        AuthSignInComponent,
        AcceptInviteComponent,
        SignUpComponent ,
    ],
    imports     : [
        RouterModule.forChild(authSignInRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,
        MatInputModule,
        MatProgressSpinnerModule,
        // FuseCardModule,
        // FuseAlertModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatStepperModule,
        SharedModule,
        NgxIntlTelInputModule
    ]
})
export class AuthSignInModule
{
}
