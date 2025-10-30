import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { MaterialModule } from 'app/shared/material.module';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { ProductGroupDetailComponent } from './group-detail.component';
import { GroupBasicInfoComponent } from './basic-info/basic-info.component';
import { GroupProductsComponent } from './products/products.component';
import { AddProductToGroupComponent } from './add-product-group/add-product-group.component';

const routes: Route[] = [
    {
        path: '',
        component: ProductGroupDetailComponent,
        children: [
            {
                path: '',
                redirectTo: 'basic',
                pathMatch: 'full',
            },
            {
                path: 'basic',
                component: GroupBasicInfoComponent
            },
            {
                path: 'products',
                component: GroupProductsComponent
            }
        ]
    }
];

@NgModule({
    declarations: [
        ProductGroupDetailComponent,
        GroupBasicInfoComponent,
        GroupProductsComponent,
        AddProductToGroupComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        FuseNavigationModule,
        FuseScrollResetModule,
        MaterialModule,
        FuseAlertModule,
        RouterModule.forChild(routes)
    ]
})
export class ProductGroupDetailModule { }
