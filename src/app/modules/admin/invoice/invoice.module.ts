import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicInvoiceComponent } from './public-invoice/public-invoice.component';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';

const routes: Route[] = [
  {
      path: ':id',
      component:PublicInvoiceComponent
  },
  ,
];

@NgModule({
  declarations: [
    PublicInvoiceComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule
  ]
})
export class InvoiceModule { }
