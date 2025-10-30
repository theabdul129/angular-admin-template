import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeveloperAppsListingComponent } from './developer-apps-listing/developer-apps-listing.component';
import { DeveloperAppsFormComponent } from './developer-apps-form/developer-apps-form.component';
import { GLOBALS } from 'app/core/config/globals';
import { RouterModule } from '@angular/router';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { MaterialModule } from 'app/shared/material.module';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatTooltipModule } from '@angular/material/tooltip';

const routes = [
  {
      path: '',
      component: DeveloperAppsListingComponent
  },
  {
      path: 'add',
      component: DeveloperAppsFormComponent,
      data: { currentAction: GLOBALS.pageActions.create }
  },
  {
      path: 'view/:_id',
      component: DeveloperAppsFormComponent,
      data: { currentAction: GLOBALS.pageActions.view }
  },
  {
      path: 'update/:_id',
      component: DeveloperAppsFormComponent,
      data: { currentAction: GLOBALS.pageActions.update }
  }

];

@NgModule({
  declarations: [
    DeveloperAppsListingComponent,
    DeveloperAppsFormComponent,

  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FuseNavigationModule,
    FuseScrollResetModule,
    MaterialModule,
    FuseAlertModule,
    MatIconModule,
    CommonModule,
    ClipboardModule,
    MatTooltipModule,
  ]
})
export class DeveloperAppsModule { }
