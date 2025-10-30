import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { ProductCategoryComponent } from './category.component';
import { CategoryListComponent } from './category-list/category-list.component';

const routes: Route[] = [
    {
        path: '',
        component: ProductCategoryComponent,
        children: [
            {
                path: '',
                component: CategoryListComponent
            },
            {
                path: ':id',
                loadChildren: () => import('../product-category/category-detail/category-detail.module').then(mod=>mod.ProductCategoryDetailModule)
            },
        ]
    }
];

@NgModule({
    declarations: [
        ProductCategoryComponent,
        CategoryListComponent
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
export class ProductCategoryModule { }
