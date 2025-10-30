import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { MaterialModule } from 'app/shared/material.module';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { CatchmentDetailComponent } from './catchment-detail.component';
import { CatchmentBasicDetailComponent } from './basic-info/basic-info.component';
import { CatchmentDeliveryChargesComponent } from './delivery-charge/delivery-charge.component';
import { CatchmentMapComponent } from './map/map.component';
// import { AgmCoreModule } from '@agm/core';
import { environment } from 'environments/environment';

const routes: Route[] = [
    {
        path: '',
        component: CatchmentDetailComponent,
        children: [
            {
                path: '',
                redirectTo: 'basic',
                pathMatch: 'full',
            },
            {
                path: 'basic',
                component: CatchmentBasicDetailComponent
            },
            {
                path: 'delivery-charges',
                component: CatchmentDeliveryChargesComponent
            },
            {
                path: 'map',
                component: CatchmentMapComponent
            }
        ]
    }
];

@NgModule({
    declarations: [
        CatchmentDetailComponent,
        CatchmentBasicDetailComponent,
        CatchmentDeliveryChargesComponent,
        CatchmentMapComponent
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
        // AgmCoreModule.forRoot({
        //     apiKey: environment.googleMapsApiKey,
        //     libraries: ["drawing"]
        //   }),
    ]
})
export class CatchmentDetailModule { }