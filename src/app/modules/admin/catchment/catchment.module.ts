import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { CatchmentListComponent } from './catchment-list/catchment-list.component';
import { CatchmentComponent } from './catchment.component';

const routes: Route[] = [
    {
        path: '',
        component: CatchmentComponent,
        children: [
            {
                path: '',
                component: CatchmentListComponent
            },
        ]
    },
    {
        path: 'add',
        loadChildren: () => import('./catchment-detail/catchment-detail.module').then(mod => mod.CatchmentDetailModule)
    },
    {
        path: ':id',
        loadChildren: () => import('./catchment-detail/catchment-detail.module').then(mod => mod.CatchmentDetailModule)
    }
];

@NgModule({   
    declarations: [
        CatchmentComponent,
        CatchmentListComponent,
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
export class CatchmentModule { }
