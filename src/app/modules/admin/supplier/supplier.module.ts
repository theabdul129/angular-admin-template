import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
// import { AgmCoreModule } from '@agm/core';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SuppliersComponent } from './supplier.component';
import { SupplierPurchaseOrdersComponent } from './purchase-order/purchase-order.component';
import { PurchaseOrderDetailComponent } from './purchase-order/order-detail/order-detail.component';

const routes: Route[] = [
    {
        path: '',
        component: SuppliersComponent,
        children: [
            {
                path: '',
                component: SupplierListComponent
            },
            {
                path: 'purchaseOrders',
                component: SupplierPurchaseOrdersComponent
            },
            {
                path: 'purchaseOrders/:id',
                component: PurchaseOrderDetailComponent
            }
        ]
    },
    {
        path: 'add',
        loadChildren: () => import('./supplier-detail/supplier-detail.module').then(mod => mod.SupplierDetailModule)
    },
    {
        path: ':id',
        loadChildren: () => import('./supplier-detail/supplier-detail.module').then(mod => mod.SupplierDetailModule)
    }
];

@NgModule({
    declarations: [
        SuppliersComponent,
        SupplierListComponent,
        SupplierPurchaseOrdersComponent,
        PurchaseOrderDetailComponent
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
export class SuppliersModule { }
