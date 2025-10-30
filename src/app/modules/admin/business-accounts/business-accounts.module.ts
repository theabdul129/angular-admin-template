import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { BusinessAccountsListComponent } from './account-list/account-list.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { BusinessAccountsComponent } from './business-accounts.component';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';

const routes: Route[] = [
    {
        path: '',
        redirectTo: 'edit',
        pathMatch: 'full'
    },
    {
        path: 'add',
        loadChildren: () =>
        import('./account-detail/account-detail.module').then(
            (mod) => mod.AccountDetailModule
        ),
    },

    {
        path: 'edit',
        loadChildren: () =>
            import('./account-detail/account-detail.module').then(
                (mod) => mod.AccountDetailModule
            ),
    },
];

@NgModule({
    declarations: [
        BusinessAccountsComponent,
        BusinessAccountsListComponent,
        AddAccountComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FuseAlertModule,
        SharedModule,
    ],
})
export class BusinessAccountsModule {}
