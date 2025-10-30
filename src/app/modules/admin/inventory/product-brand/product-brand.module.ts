import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { BrandListComponent } from './brand-list/brand-list.component';
import { ProductBrandsComponent } from './product-brand.component';

const routes: Route[] = [
    {
        path: '',
        component: ProductBrandsComponent,
        children: [
            {
                path: '',
                component: BrandListComponent
            },
            {
                path: 'add',
                loadChildren: () => import('../product-brand/brand-detail/brand-detail.module').then(mod => mod.ProductBrandDetailModule)
            },
            {
                path: ':id',
                loadChildren: () => import('../product-brand/brand-detail/brand-detail.module').then(mod => mod.ProductBrandDetailModule)
            }
        ]
    }
];

@NgModule({
    declarations: [
        ProductBrandsComponent,
        BrandListComponent
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
export class ProductBrandsModule { }
