import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { InventoryComponent } from './inventory.component';
import { ListProductComponent } from './product/list-product/list-product.component';
import { SaveProductComponent } from './product/save-product/save-product.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const routes: Route[] = [
    {
        path: '',
        component: InventoryComponent,
        children: [
            {
                path: '',
                component: ListProductComponent
            },
            {
                path: 'add',
                component: SaveProductComponent
            },
            {
                path: 'edit/:id',
                loadChildren: () => import('./product/product-detail/product-detail.module').then(mod => mod.ProductDetailModule)
            }
        ]
    }
];

@NgModule({
    declarations: [
        InventoryComponent,
        ListProductComponent,
        SaveProductComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FuseAlertModule,
        SharedModule,
        NgxMatSelectSearchModule
    ]
})
export class InventoryModule { }
