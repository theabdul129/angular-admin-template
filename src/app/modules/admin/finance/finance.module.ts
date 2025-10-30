import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { financeComponent } from './finance.component';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { LendersListingComponent } from './lenders-listing/lenders-listing.component';
import { LenderDetailComponent } from './lender-detail/lender-detail.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { MatListModule } from '@angular/material/list';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { ApplicationsComponent } from './applications/applications.component';
import { DecisionOverviewComponent } from './lender-detail/decision-overview/decision-overview.component';
import { CreditDetailsComponent } from './lender-detail/credit-details/credit-details.component';
import { FinanceApplicationHistoryComponent } from './lender-detail/finance-application-history/finance-application-history.component';
import { FinanceApplicationNotesComponent } from './lender-detail/finance-application-notes/finance-application-notes.component';
import { ConsentApplicationComponent } from './lender-detail/consent-application/consent-application.component';
import { ApplicationDetailComponent } from './applications/application-detail/application-detail.component';
import { UserDetailComponent } from './applications/user-detail/user-detail.component';

const routes: Route[] = [
    {
        path: '',
        component:LendersListingComponent
    },
    {
        path: 'detail/:id',
        component:LenderDetailComponent
    },
    {
        path: 'application/:appId',
        component:ApplicationDetailComponent
    },
];

@NgModule({
    declarations: [financeComponent,LendersListingComponent, LenderDetailComponent,ProfileDetailsComponent, PaymentDetailsComponent, ApplicationsComponent, DecisionOverviewComponent, CreditDetailsComponent, FinanceApplicationHistoryComponent, FinanceApplicationNotesComponent, ConsentApplicationComponent, ApplicationDetailComponent, UserDetailComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FuseAlertModule,
        SharedModule,
        MatListModule
    ],
})
export class PaymentsModule {}
