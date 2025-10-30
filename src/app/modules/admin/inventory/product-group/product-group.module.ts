import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { GroupListComponent } from './group-list/group-list.component';
import { ProductGroupsComponent } from './product-group.component';

const routes: Route[] = [
    {
        path: '',
        component: ProductGroupsComponent,
        children: [
            {
                path: '',
                component: GroupListComponent
            },
            {
                path: 'add',
                loadChildren: () => import('../product-group/group-detail/group-detail.module').then(mod => mod.ProductGroupDetailModule)
            },
            {
                path: ':id',
                loadChildren: () => import('../product-group/group-detail/group-detail.module').then(mod => mod.ProductGroupDetailModule)
            }
        ]
    }
];

@NgModule({
    declarations: [
        ProductGroupsComponent,
        GroupListComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FuseAlertModule,
        SharedModule
    ]
})
export class ProductGroupsModule { }
