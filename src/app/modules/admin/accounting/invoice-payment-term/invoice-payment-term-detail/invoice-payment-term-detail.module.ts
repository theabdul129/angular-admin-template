
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { MaterialModule } from 'app/shared/material.module';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { InvoiceBasicDetailComponent } from './basic-info/basic-info.component';
import { InvoicePaymentTermDetailComponent } from './invoice-payment-term-detail.component';

const routes: Route[] = [
    {
        path: '',
        component: InvoicePaymentTermDetailComponent,
        children: [
            {
                path: '',
                redirectTo: 'basic',
                pathMatch: 'full',
            },
            {
                path: 'basic',
                component: InvoiceBasicDetailComponent
            }
        ]
    }
];

@NgModule({
    declarations: [
        InvoicePaymentTermDetailComponent,
        InvoiceBasicDetailComponent,
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
export class InvoicePaymentTermDetailModule { }