import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { ManufacturerListComponent } from './manufacturer-list/manufacturer-list.component';
import { ProductManufacturerComponent } from './product-manufacturer.component';

const routes: Route[] = [
    {
        path: '',
        component: ProductManufacturerComponent,
        children: [
            {
                path: '',
                component: ManufacturerListComponent
            },
            {
                path: 'add',
                loadChildren: () => import('../product-manufacturer/manufacturer-detail/manufacturer-detail.module').then(mod => mod.ProductManufacturerDetailModule)
            },
            {
                path: ':id',
                loadChildren: () => import('../product-manufacturer/manufacturer-detail/manufacturer-detail.module').then(mod => mod.ProductManufacturerDetailModule)
            }
        ]
    }
];

@NgModule({
    declarations: [
        ProductManufacturerComponent,
        ManufacturerListComponent
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
export class ProductManufacturerModule { }
