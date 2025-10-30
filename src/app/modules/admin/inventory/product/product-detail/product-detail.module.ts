import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { MaterialModule } from 'app/shared/material.module';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { ProductBasicDetailComponent } from './basic-detail/basic-detail.component';
import { ProductDetailComponent } from './product-detail.component';
import { ProductImagesComponent } from './product-images/product-images.component';
import { SaveProductImageComponent } from '../save-product-image/save-product-image.component';
import { GtinsComponent } from './gtins/gtins.component';
import { RelatedProductComponent } from './related-products/related-products.component';
import { ProductPackages } from './packages/packages.component';
import { SaveProductPackageComponent } from '../save-product-package/save-product-package.component';
import { CatchmentPriceComponent } from './catchmentprice/catchmentprice.component';
import { ViewCatchmentProductInformationComponent } from './view-catchment-product-information/view-catchment-product-information.component';
import { ProductMoreInfoComponent } from './more-info/more-info.component';
import { TagsComponent } from './tags/tags.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { PreviewImageComponent } from './preview-image/preview-image.component';

const routes: Route[] = [
    {
        path: '',
        component: ProductDetailComponent,
        children: [
            {
                path: '',
                redirectTo: 'basic',
                pathMatch: 'full',
            },
            {
                path: 'basic',
                component: ProductBasicDetailComponent
            },
            {
                path: 'images',
                component: ProductImagesComponent
            },
            {
                path: 'gtins',
                component: GtinsComponent
            },
            {
                path: 'relatedProducts',
                component: RelatedProductComponent
            },
            {
                path: 'packages',
                component: ProductPackages
            },
            {
                path: 'catchmentprice',
                component: CatchmentPriceComponent
            },
            {
                path: 'more-information',
                component: ProductMoreInfoComponent
            },
            {
                path: 'qr-code',
                component: QrCodeComponent
            },
            {
                path: 'tags',
                component: TagsComponent
            }
        ]
    }
];

@NgModule({
    declarations: [
        ProductDetailComponent,
        ProductBasicDetailComponent,
        ProductImagesComponent,
        SaveProductImageComponent,
        GtinsComponent,
        RelatedProductComponent,
        ProductPackages,
        SaveProductPackageComponent,
        CatchmentPriceComponent,
        ViewCatchmentProductInformationComponent,
        ProductMoreInfoComponent,
        TagsComponent,
        QrCodeComponent,
        PreviewImageComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        FuseNavigationModule,
        FuseScrollResetModule,
        MaterialModule,
        FuseAlertModule,
        RouterModule.forChild(routes),
        NgxMatSelectSearchModule
    ]
})
export class ProductDetailModule { }
