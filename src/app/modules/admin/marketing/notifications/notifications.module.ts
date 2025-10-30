import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { NotificationsComponent } from './notifications.component';
import { AddNotificationComponent } from './add/add-notification';

const routes: Route[] = [
    {
        path: '',
        component: NotificationsComponent,
    },
    {
        path: 'add',
        component: AddNotificationComponent
    }
];

@NgModule({
    declarations: [
        NotificationsComponent,
        AddNotificationComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FuseAlertModule,
        SharedModule
    ]
})

export class NotificationsModule { }
