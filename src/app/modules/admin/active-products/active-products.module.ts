import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveProductsComponent } from './active-products.component';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';


const routes: Route[] = [
  {
      path: '',
      component: ActiveProductsComponent,
      
  }
];


@NgModule({
  declarations: [ActiveProductsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FuseAlertModule,
    SharedModule,

    RouterModule.forChild(routes),
  ]
})
export class ActiveProductsModule { }
