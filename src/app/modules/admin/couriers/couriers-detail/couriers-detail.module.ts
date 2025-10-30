import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { MaterialModule } from 'app/shared/material.module';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { CourierBasicDetailComponent } from './basic-info/basic-info.component';
import { CourierrDetailComponent } from './couriers-detail.component';
import { CourierRoutesComponent } from './routes/routes.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
// import { AgmCoreModule } from '@agm/core';
import { environment } from 'environments/environment';
import { CourierQRCodeComponent } from './qr-code/qr-code.component';

const routes: Route[] = [
    {
        path: '',
        component: CourierrDetailComponent,
        children: [
            {
                path: '',
                redirectTo: 'basic',
                pathMatch: 'full',
            },
            {
                path: 'basic',
                component: CourierBasicDetailComponent
            },
            {
                path: 'routes',
                component: CourierRoutesComponent
            },
            {
                path: 'qr-code',
                component: CourierQRCodeComponent
            }
        ]
    }
];

@NgModule({
    declarations: [
        CourierrDetailComponent,
        CourierBasicDetailComponent,
        CourierRoutesComponent,
        CourierQRCodeComponent,
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
        // }),
        NgxIntlTelInputModule
    ]
})
export class CourierDetailModule { }