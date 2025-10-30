import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { MaterialModule } from 'app/shared/material.module';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { BrandBasicInfoComponent } from './basic-info/basic-info.component';
import { ProductBrandDetailComponent } from './brand-detail.component';

const routes: Route[] = [
    {
        path: '',
        component: ProductBrandDetailComponent,
        children: [
            {
                path: '',
                redirectTo: 'basic',
                pathMatch: 'full',
            },
            {
                path: 'basic',
                component: BrandBasicInfoComponent
            }
        ]
    }
];

@NgModule({
    declarations: [
        ProductBrandDetailComponent,
        BrandBasicInfoComponent
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
export class ProductBrandDetailModule { }
