import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { CustomersComponent } from './customers.component';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { IconsModule } from 'app/core/icons/icons.module';

const routes: Route[] = [
    {
        path: '',
        component: CustomersComponent,
        children: [
            {
                path: '',
                component: CustomersListComponent
            },
        ]
    },
    {
        path: 'add',
        loadChildren: () => import('./customer-detail/customer-detail.module').then(mod => mod.CustomerDetailModule)
    },
    {
        path: ':id',
        loadChildren: () => import('./customer-detail/customer-detail.module').then(mod => mod.CustomerDetailModule)
    }
];

@NgModule({
    declarations: [
        CustomersComponent,
        CustomersListComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FuseAlertModule,
        SharedModule,
        IconsModule
    ]
})
export class CustomersModule { }
