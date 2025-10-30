import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { MaterialModule } from 'app/shared/material.module';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { StoreDetailComponent } from './store-detail.component';
import { StoreBasicDetailComponent } from './basic-detail/basic-detail.component';


import { StoreOtherInfoComponent } from './other-info/other-info.component';
// import { AgmCoreModule } from '@agm/core';
import { StoreInventoryComponent } from './inventory/inventory.component';
import { AddProductInventoryComponent } from './add-product-inventory/add-product-inventory.component';
import { StoreApiComponent } from './store-api/store-api.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { StockAdjustmentComponent } from './stock-adjustment/stock-adjustment.component';
import { environment } from 'environments/environment';
import { OpeningHoursComponent } from './opening-hours/opening-hours.component';
import { StoreStockComponent } from './store-stock/store-stock.component';
import { LowStockComponent } from './low-stock/low-stock.component';
import { AdjustmentDetailComponent } from './adjustment-info/adjustment-info.component';

const routes: Route[] = [
    {
        path: '',
        component: StoreDetailComponent,
        children: [
            {
                path: '',
                redirectTo: 'basic',
                pathMatch: 'full',
            },
            {
                path: 'basic',
                component: StoreBasicDetailComponent
            },
            {
                path: 'other',
                component: StoreOtherInfoComponent
            },
            {
                path: 'inventory',
                component: StoreInventoryComponent
            },
            {
                path: 'api',
                component: StoreApiComponent
            },
            {
                path: 'upload-product-file',
                component: FileManagerComponent
            },
            {
                path: 'stock-adjustments',
                component: StockAdjustmentComponent
            },
            {
                path: 'opening-hours',
                component: OpeningHoursComponent
            },
            {
                path: 'inventory/:id/stock',
                component: StoreStockComponent
            },
            {
                path: 'stock-adjustments/:id',
                component: AdjustmentDetailComponent
            },
            {
                path: 'low-stock',
                component: LowStockComponent
            },
        ]
    }
];

@NgModule({
    declarations: [
        StoreDetailComponent,
        StoreBasicDetailComponent,
        StoreOtherInfoComponent,
        StoreInventoryComponent,
        AddProductInventoryComponent,
        StoreApiComponent,
        ViewProductComponent,
        FileManagerComponent,
        StockAdjustmentComponent,
        OpeningHoursComponent,
        StoreStockComponent,
        LowStockComponent,
        AdjustmentDetailComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        FuseNavigationModule,
        FuseScrollResetModule,
        MaterialModule,
        FuseAlertModule,
        // AgmCoreModule.forRoot({
        //     apiKey: environment.googleMapsApiKey,
        //     libraries: ["drawing"]
        // }),
        RouterModule.forChild(routes),
    ]
})
export class StoreDetailModule { }
