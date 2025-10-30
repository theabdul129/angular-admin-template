import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
// import { AgmCoreModule } from '@agm/core';
import { AdvertListComponent } from './advert-list/advert-list.component';
import { AdvertComponent } from './advert.component';

const routes: Route[] = [
    {
        path: '',
        component: AdvertComponent,
        children: [
            {
                path: '',
                component: AdvertListComponent
            },
        ]
    },
    {
        path: 'add',
        loadChildren: () => import('./advert-detail/advert-detail.module').then(mod => mod.AdvertDetailModule)
    },
    {
        path: ':id',
        loadChildren: () => import('./advert-detail/advert-detail.module').then(mod => mod.AdvertDetailModule)
    }
];

@NgModule({
    declarations: [
        AdvertComponent,
        AdvertListComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FuseAlertModule,
        SharedModule,
        // AgmCoreModule
    ]
})
export class AdvertsModule { }
