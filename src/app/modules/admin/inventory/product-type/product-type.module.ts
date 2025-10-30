import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { ProductTypesComponent } from './product-type.component';

const routes: Route[] = [
    {
        path: '',
        component: ProductTypesComponent,
    },
    {
        path: 'add',
        loadChildren: () => import('./details/details.module').then(mod => mod.ProductDetailTypeModule)
    },
    {
        path: 'edit/:id',
        loadChildren: () => import('./details/details.module').then(mod => mod.ProductDetailTypeModule)
    }
];

@NgModule({
    declarations: [
        ProductTypesComponent,
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
export class ProductTypesModule { }