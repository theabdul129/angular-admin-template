import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { AddStoreComponent } from './add-store/add-store.component';
import { StoreListComponent } from './store-list/store-list.component';
import { StoresComponent } from './store.component';
import { SharedModule } from 'app/shared/shared.module';
// import { AgmCoreModule } from '@agm/core';

const routes: Route[] = [
    {
        path: '',
        component: StoresComponent,
        children: [
            {
                path: '',
                component: StoreListComponent
            },
            {
                path:'create',
                component: AddStoreComponent
            },
            {
                path: 'edit/:id',
                loadChildren: () => import('./store-detail/store-detail.module').then(mod => mod.StoreDetailModule)
            }
        ]
    }
];

@NgModule({
    declarations: [
        StoresComponent,
        StoreListComponent,
        AddStoreComponent,

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
export class StoresModule { }
