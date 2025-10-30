
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { MaterialModule } from 'app/shared/material.module';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { SupplierBasicDetailComponent } from './basic-info/basic-info.component';
import { SupplierDetailComponent } from './supplier-detail.component';
import { SupplierInvoiceTermsComponent } from './invoice-terms/invoice-terms.component';
import { DeliveryTermsComponent } from './delivery-terms/delivery-terms.component';
import { SupplierProductsComponent } from './products/products.component';
import { SupplierProductPricesComponent } from './prices/prices.component';
import { SupplierContactsComponent } from './contacts/contacts.component';

const routes: Route[] = [
    {
        path: '',
        component: SupplierDetailComponent,
        children: [
            {
                path: '',
                redirectTo: 'basic',
                pathMatch: 'full',
            },
            {
                path: 'basic',
                component: SupplierBasicDetailComponent
            },
            {
                path: 'invoice-terms',
                component: SupplierInvoiceTermsComponent
            },
            {
                path: 'invoice-terms/:id/delivery-terms',
                component: DeliveryTermsComponent
            },
            {
                path:'products',
                component: SupplierProductsComponent
            },
            {
                path: 'products/:id',
                component: SupplierProductPricesComponent
            },
            {
                path: 'contacts',
                component: SupplierContactsComponent
            }
        ]
    }
];

@NgModule({
    declarations: [
        SupplierDetailComponent,
        SupplierBasicDetailComponent,
        SupplierInvoiceTermsComponent,
        DeliveryTermsComponent,
        SupplierProductsComponent,
        SupplierProductPricesComponent,
        SupplierContactsComponent
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
export class SupplierDetailModule { }