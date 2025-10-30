import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { LendersComponent } from './lenders.component';
import { LendersListComponent } from './lenders-list/lenders-list.component';
import { SaveLenderComponent } from './save-lender/save-lender.component';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';






const routes: Route[] = [
    {
        path: '',
        component: LendersComponent,
        children: [
            {
                path: '',
                component: LendersListComponent
            },
            {
                path: 'add',
               component:SaveLenderComponent
            },
            {
                path:'edit/:id',
                loadChildren:()=> import('./lender-details/lender-details.module').then(m=>m.LenderDetailsModule)
            }
        ]
    },
];

@NgModule({
    declarations: [
        LendersComponent,
        LendersListComponent,
        SaveLenderComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FuseAlertModule,
        SharedModule,
        FuseNavigationModule,
        NgxMatSelectSearchModule,
    ]
})
export class LendersModule { }
