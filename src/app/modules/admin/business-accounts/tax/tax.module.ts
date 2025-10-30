import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
// import { AgmCoreModule } from '@agm/core';
import { TaxComponent } from './tax.component';
import { TaxListComponent } from './tax-list/tax-list.component';

const routes: Route[] = [
    {
        path: '',
        component: TaxComponent,
        children: [
            {
                path: '',
                component: TaxListComponent
            },
        ]
    },
    {
        path: 'add',
        loadChildren: () => import('./tax-detail/tax-detail.module').then(mod => mod.TaxDetailModule)
    },
    {
        path: ':id',
        loadChildren: () => import('./tax-detail/tax-detail.module').then(mod => mod.TaxDetailModule)
    }
];

@NgModule({
    declarations: [
        TaxComponent,
        TaxListComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FuseAlertModule,
        SharedModule,
        // AgmCoreModule
    ]
})
export class TaxModule { }
