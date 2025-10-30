import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { MaterialModule } from 'app/shared/material.module';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { AccountCollaboratorsComponent } from './collaborators.component';

import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import { ListBusinessAccountCollaboratorsComponent } from './list-collaborators/list-business-account-collaborators.component';

const routes: Route[] = [
    {
        path: '',
        component: AccountCollaboratorsComponent,
    },
    {
        path: ':id',

        loadChildren: () =>
            import('./detail-collaborators/collaborator-detail.module').then(
                (mod) => mod.CollaboratorDetailModule
            ),
    },
];

@NgModule({
    declarations: [AccountCollaboratorsComponent,ListBusinessAccountCollaboratorsComponent],
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
export class CollaboratorModule {}
