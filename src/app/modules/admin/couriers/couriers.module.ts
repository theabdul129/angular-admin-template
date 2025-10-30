import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { CouriersComponent } from './couriers.component';
import { CouriersListComponent } from './couriers-list/couriers-list.component';

const routes: Route[] = [
    {
        path: '',
        component: CouriersComponent,
        children: [
            {
                path: '',
                component: CouriersListComponent
            },
        ]
    },
    {
        path: 'add',
        loadChildren: () => import('./couriers-detail/couriers-detail.module').then(mod => mod.CourierDetailModule)
    },
    {
        path: ':id',
        loadChildren: () => import('./couriers-detail/couriers-detail.module').then(mod => mod.CourierDetailModule)
    }
];

@NgModule({
    declarations: [
        CouriersComponent,
        CouriersListComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FuseAlertModule,
        SharedModule,
    ]
})
export class CouriersModule { }
