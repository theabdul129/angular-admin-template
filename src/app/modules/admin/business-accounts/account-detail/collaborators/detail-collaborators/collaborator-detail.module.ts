import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { MaterialModule } from 'app/shared/material.module';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';

import { UserBasicDetailComponent } from './basic-info/basic-info.component';
import { CollaboratorDetailComponent } from './collaborator-detail.component';
import { UserRolesComponent } from './roles/roles.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';

const routes: Route[] = [
    {
        path: '',
        component: CollaboratorDetailComponent,
        children: [
            {
                path: '',
                redirectTo: 'basic',
                pathMatch: 'full',
            },
            {
                path: 'basic',
                component: UserBasicDetailComponent,
            },
            {
                path: 'roles',
                component: UserRolesComponent,
            },
        ],
    },
];

@NgModule({
    declarations: [
        CollaboratorDetailComponent,
        UserBasicDetailComponent,
        UserRolesComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        FuseNavigationModule,
        FuseScrollResetModule,
        MaterialModule,
        FuseAlertModule,
        RouterModule.forChild(routes),
        NgxIntlTelInputModule,
    ],
})
export class CollaboratorDetailModule {}
