import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { RoutesComponent } from './routes.component';
import { RouteDetailComponent } from './detail/detail.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
// import { AgmCoreModule } from '@agm/core';
import { environment } from 'environments/environment';

const routes: Route[] = [
    {
        path: '',
        component: RoutesComponent,
    },
    {
        path: ':id',
        component: RouteDetailComponent
    }
];

@NgModule({
    declarations: [
        RoutesComponent,
        RouteDetailComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FuseAlertModule,
        SharedModule,
        NgxMatSelectSearchModule,
        // AgmCoreModule.forRoot({
        //     apiKey: environment.googleMapsApiKey,
        //     libraries: ["drawing"]
        //   }),
    ]
})
export class RoutesModule { }
