import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThirdPartyConnectorsListingComponent } from './third-party-connectors-listing/third-party-connectors-listing.component';
import { Route, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { MaterialModule } from 'app/shared/material.module';
import { SharedModule } from 'app/shared/shared.module';
import { ThirdPartyResourceComponent } from './third-party-resource/third-party-resource.component';
import { FileUploaderModule } from './file-uploader/file-uploader.module';
import { DatasourceListingComponent } from './datasource-listing/datasource-listing.component';

const routes: Route[] = [
  {
      path: '',
      children: [
          {
              path: '',
              component: DatasourceListingComponent
          },
          {
              path: 'add-datasource',
              component: ThirdPartyConnectorsListingComponent
          },
      ]
  }
];
@NgModule({
  declarations: [
    ThirdPartyConnectorsListingComponent,
    ThirdPartyResourceComponent,
    DatasourceListingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FuseAlertModule,
    SharedModule,
    FileUploaderModule
  ]
})
export class ThirdPartyConnectorsModule { }
