import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { CommunicationsListComponent } from './communication-list/communication-list.component';
import { CommunicationComponent } from './communication.component';

const routes: Route[] = [
    {
        path: '',
        component: CommunicationComponent,
        children: [
            {
                path: '',
                component: CommunicationsListComponent
            },
        ]
    },
    {
        path: ':id',
        loadChildren: () => import('./communication-detail/communication-detail.module').then(mod => mod.CommunicationsDetailModule)
    }
];

@NgModule({
    declarations: [
        CommunicationComponent,
        CommunicationsListComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FuseAlertModule,
        SharedModule,
    ]
})
export class CommunicationsModule { }
