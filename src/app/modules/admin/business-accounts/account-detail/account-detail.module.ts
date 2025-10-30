import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AccountDetailComponent } from './account-detail.component';
import { AccountBasicDetailComponent } from './basic-detail/basic-detail.component';
// import { AccountCollaboratorsComponent } from './collaborators/collaborators.component';
import { AccountStoresComponent } from './stores/stores.component';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { MaterialModule } from 'app/shared/material.module';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
// import { ListBusinessAccountCollaboratorsComponent } from './collaborators/list-collaborators/list-business-account-collaborators.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import { DocumentsComponent } from './documents/documents.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { WebHooksComponent } from './web-hooks/web-hooks.component';
import { WebHookFormComponent } from './web-hooks/web-hook-form/web-hook-form.component';
const routes: Route[] = [
    {
        path: '',
        component: AccountDetailComponent,
        children: [
            {
                path: '',
                redirectTo: 'basic',
                pathMatch: 'full',
            },
            {
                path: 'basic',
                component: AccountBasicDetailComponent
            },
            {
                path: 'collaborators',
                loadChildren: () => import('./collaborators/collaborators.module').then(mod => mod.CollaboratorModule),
            },
            {
                path: 'stores',
                component: AccountStoresComponent
            },
            {
                path: 'bank-details',
                component: BankDetailsComponent
            },
            {
                path: 'developer-apps',
                loadChildren: () => import('../developer-apps/developer-apps.module').then(mod => mod.DeveloperAppsModule),
            },
            {
                path: 'webhooks',
                component:WebHooksComponent
            },
            {
                path: 'webhooks/:env',
                component:WebHookFormComponent
            },
            {
                path: 'webhooks/:env',
                component:WebHookFormComponent
            },
            {
                path: 'tax',
                loadChildren: () => import('../tax/tax.module').then(mod => mod.TaxModule),
            },
        ]
    }
];

@NgModule({
    declarations: [
        AccountDetailComponent,
        AccountBasicDetailComponent,
        // AccountCollaboratorsComponent,
        AccountStoresComponent,
        // ListBusinessAccountCollaboratorsComponent,
        DocumentsComponent,
        BankDetailsComponent,
        WebHooksComponent,
        WebHookFormComponent
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
        NgxIntlTelInputModule
    ]
})
export class AccountDetailModule { }
