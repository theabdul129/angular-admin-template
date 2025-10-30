import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { MaterialModule } from 'app/shared/material.module';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { ProductBasicDetailComponent } from './basic-info/basic-info.component';
import { ProductCategoryDetailComponent } from './category-detail.component';
import { ProductCategoryImagesComponent } from './images/images.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { SaveChildProductCategoryComponent } from './save-child-product-category/save-child-product-category.component';
import { ProductRelatedCategoryComponent } from './related-category/related-category.component';

const routes: Route[] = [
    {
        path: '',
        component: ProductCategoryDetailComponent,
        children: [
            {
                path: '',
                redirectTo: 'basic',
                pathMatch: 'full',
            },
            {
                path: 'basic',
                component: ProductBasicDetailComponent
            },
            {
                path: 'images',
                component: ProductCategoryImagesComponent
            },
            {
                path: 'product-categories',
                component: ProductCategoryComponent
            },
            {
                path: 'related-categories',
                component: ProductRelatedCategoryComponent
            }
        ]
    },
];

@NgModule({
    declarations: [
        ProductCategoryDetailComponent,
        ProductBasicDetailComponent,
        ProductCategoryImagesComponent,
        ProductCategoryComponent,
        SaveChildProductCategoryComponent,
        ProductRelatedCategoryComponent
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
    ],
})
export class ProductCategoryDetailModule { }
