import { NgModule } from '@angular/core';
import {Location} from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { MaterialModule } from 'app/shared/material.module';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSliderModule } from '@angular/material/slider';
import { LenderDetailsComponent } from './lender-details.component';
import { BasicLenderInfoComponent } from './basic-lender-info/basic-lender-info.component';
import { LenderProductComponent } from './lender-product/lender-product.component';
import { LenderRuleComponent } from './lender-rule/lender-rule.component';

const routes: Route[] = [
    {
        path: '',
        component: LenderDetailsComponent,
        children: [
            {
                path: '',
                redirectTo: 'basic',
                pathMatch: 'full',
            },
            {
                path: 'basic',
                component: BasicLenderInfoComponent
            },
            {
                path: 'lenderProduct',
                component: LenderProductComponent,
            },
            {
                path: 'lenderProduct/:id',
                component: LenderRuleComponent ,
            },
        ]
    }
];

@NgModule({
    declarations: [
      LenderDetailsComponent,
      BasicLenderInfoComponent,
      LenderProductComponent,
      LenderRuleComponent
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
        NgxMatSelectSearchModule,
        MatSliderModule
    ],
    bootstrap:[Location]
})
export class LenderDetailsModule { }
