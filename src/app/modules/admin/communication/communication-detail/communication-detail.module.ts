import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { MaterialModule } from 'app/shared/material.module';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { CommunicationBasicDetailComponent } from './basic-info/basic-info.component';
import { CommunicationDetailComponent } from './communication-detail.component';
import { FormServiceBodyComponent } from '../form-service-body/form-service-body.component';
import { CKEditorModule } from 'ckeditor4-angular';

const routes: Route[] = [
    {
        path: '',
        component: CommunicationDetailComponent,
        children: [
            {
                path: '',
                redirectTo: 'basic',
                pathMatch: 'full',
            },
            {
                path: 'basic',
                component: CommunicationBasicDetailComponent
            },
        ]
    }
];

@NgModule({
    declarations: [
        CommunicationDetailComponent,
        CommunicationBasicDetailComponent,
        FormServiceBodyComponent
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
        CKEditorModule
    ]
})
export class CommunicationsDetailModule { }
