import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
// import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
// import { AgmCoreModule } from '@agm/core';
import { UsersComponent } from './users.component';
import { UsersListComponent } from './user-list/user-list.component';
import { UsersViewComponent } from './user-view/user-view.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Route[] = [
    {
        path: '',
        component: UsersComponent,
        children: [
            {
                path: '',
                component: UsersListComponent
            },
            {
                path: 'current',
                component: UsersViewComponent
            },
            {
                path: 'reset-password',
                component: ResetPasswordComponent
            }
        ]
    },
    {
        path: 'add',
        loadChildren: () => import('./user-detail/user-detail.module').then(mod => mod.UserDetailModule)
    },
    {
        path: ':id',
        loadChildren: () => import('./user-detail/user-detail.module').then(mod => mod.UserDetailModule)
    }
];

@NgModule({
    declarations: [
        UsersComponent,
        UsersListComponent,
        UsersViewComponent,
        ResetPasswordComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        // FuseAlertModule,
        SharedModule,
        // AgmCoreModule,
        NgxIntlTelInputModule
    ]
})
export class UsersModule { }
