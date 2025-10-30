import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { ProductTypeDetailComponent } from './details.component';
import { ProductTypeBasicDetailComponent } from './basic-info/basic-info.component';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { ProductTypeAttributesComponent } from './attributes/attributes.component';

const routes: Route[] = [
    {
        path: '',
        component: ProductTypeDetailComponent,
        children: [
            {
                path: '',
                redirectTo: 'basic',
                pathMatch: 'full',
            },
            {
                path: 'edit/:id',
                component: ProductTypeBasicDetailComponent
            },
            {
                path: 'basic',
                component: ProductTypeBasicDetailComponent
            },
            {
                path: 'attributes',
                component: ProductTypeAttributesComponent
            }
        ]
    }
];

@NgModule({
    declarations: [
        ProductTypeDetailComponent,
        ProductTypeBasicDetailComponent,
        ProductTypeAttributesComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FuseAlertModule,
        SharedModule,
        FuseNavigationModule,
        FuseScrollResetModule,
    ]
})
export class ProductDetailTypeModule { }
