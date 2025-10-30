import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { DocumentationComponent } from './documentation.component';
import { HelpComponent } from './help/help.component';
import { SupportComponent } from './support/support.component';

const routes: Route[] = [
    {
        path: '',
        component: DocumentationComponent,
    },
    {
        path: 'help',
        component: HelpComponent
    },
    {
        path: 'support',
        component: SupportComponent
    }
];

@NgModule({
    declarations: [
        DocumentationComponent,
        HelpComponent,
        SupportComponent
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
export class DocumentationModule { }
