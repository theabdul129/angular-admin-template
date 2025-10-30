import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { AnalyticsComponent } from './analytics.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { OverAllSalesComponent } from './overall-sales/overall-sales.component';
import { ProductSalesComponent } from './product-sales/product-sales.component';
import { CategorySalesComponent } from './category-sales/category-sales.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const routes: Route[] = [
    {
        path: '',
        component: AnalyticsComponent,
        children: [
            {
                path: '',
                redirectTo: 'overall',
                pathMatch: 'full'
            },
            {
                path: 'overall',
                component: OverAllSalesComponent
            },
            {
                path: 'product',
                component: ProductSalesComponent
            },
            {
                path: 'category',
                component: CategorySalesComponent
            }
        ]
    }
];

@NgModule({
    declarations: [
        AnalyticsComponent,
        OverAllSalesComponent,
        ProductSalesComponent,
        CategorySalesComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FuseAlertModule,
        SharedModule,
        NgApexchartsModule,
        NgxMatSelectSearchModule
    ]
})
export class AnalyticsModule { }
