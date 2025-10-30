import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
// import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
// import { AgmCoreModule } from '@agm/core';
import { InvoicePaymentTermListComponent } from './invoice-payment-term-list/invoice-payment-term-list.component';
import { InvoicePaymentTermComponent } from './invoice-payment-term.component';

const routes: Route[] = [
    {
        path: '',
        component: InvoicePaymentTermComponent,
        children: [
            {
                path: '',
                component: InvoicePaymentTermListComponent
            },
        ]
    },
    {
        path: 'add',
        loadChildren: () => import('./invoice-payment-term-detail/invoice-payment-term-detail.module').then(mod => mod.InvoicePaymentTermDetailModule)
    },
    {
        path: ':id',
        loadChildren: () => import('./invoice-payment-term-detail/invoice-payment-term-detail.module').then(mod => mod.InvoicePaymentTermDetailModule)
    }
];

@NgModule({
    declarations: [
        InvoicePaymentTermComponent,
        InvoicePaymentTermListComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        // AgmCoreModule
    ]
})
export class InvoicePaymentTermModule { }
