import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { MaterialModule } from 'app/shared/material.module';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { CustomerBasicDetailComponent } from './basic-info/basic-info.component';
import { CustomerDetailComponent } from './customer-detail.component';
import { DeliveryAddressComponent } from './delivery-address/delivery-address.component';
import { CustomerOrdersComponent } from './orders/orders.component';
import { CustomerOrderDetailComponent } from './orders/order-detail/order-detail.component';
import { CustomerViewDetailComponent } from './view-detail/view-detail.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import { BasketComponent } from './basket/basket.component';
import { CouponsComponent } from './coupons/coupons.component';
import { AddressDropDownComponent } from './basket/address-drop-down/address-drop-down.component';
import { AffordabilityComponent } from './affordability/affordability.component';
import { ChatComponent } from './chat/chat.component';
import { MatListModule } from '@angular/material/list';
import { CustomerSequenceComponent } from './customer-sequence/customer-sequence.component';
import { CustomerDynamicOverviewComponent } from './customer-dynamic-overview/customer-dynamic-overview.component';
import { PlainEnglishCasePipe } from './customer-dynamic-overview/plain-english-case.pipe';

const routes: Route[] = [
    {
        path: '',
        component: CustomerDetailComponent,
        children: [
            {
                path: '',
                redirectTo: 'detail',
                pathMatch: 'full',
            },
            {
                path: 'add-detail',
                component: CustomerBasicDetailComponent
            },
            {
                path: 'detail/edit',
                component: CustomerBasicDetailComponent
            },
            {
                path: 'delivery-address',
                component: DeliveryAddressComponent
            },
            {
                path: 'orders',
                component: CustomerOrdersComponent
            },
            {
                path: 'orders/:id',
                component: CustomerOrderDetailComponent
            },
            {
                path: 'detail',
                component: CustomerViewDetailComponent
            },
            {
                path: 'basket',
                component: BasketComponent
            },
            {
                path: 'coupons',
                component: CouponsComponent
            },
            {
                path: 'affordability',
                component: AffordabilityComponent
            },
            {
                path: 'insight',
                loadChildren: () => import('./chat/chat.routes').then(mod => mod.ROUTES)
            }
        ]
    }
];

@NgModule({
    declarations: [
        CustomerDetailComponent,
        CustomerBasicDetailComponent,
        DeliveryAddressComponent,
        CustomerOrdersComponent,
        CustomerOrderDetailComponent,
        CustomerViewDetailComponent,
        BasketComponent,
        CouponsComponent,
        AddressDropDownComponent,
        AffordabilityComponent,
        CustomerSequenceComponent,
        CustomerDynamicOverviewComponent,
        PlainEnglishCasePipe,
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
        NgxIntlTelInputModule,
        MatListModule,

    ]
})
export class CustomerDetailModule { }