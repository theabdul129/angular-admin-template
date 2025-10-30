import { Route } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { InitialDataResolver } from 'app/app.resolvers';
import { LayoutComponent } from './layout/layout.component';

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [

    // Auth routes for guests
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: '', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
        ]
    },

    {
        path: 'invoice',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: '', loadChildren: () => import('app/modules/admin/invoice/invoice.module').then(m => m.InvoiceModule) },
        ]
    },


    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            { path: 'admin/business-account', loadChildren: () => import('app/modules/admin/business-accounts/business-accounts.module').then(m => m.BusinessAccountsModule) },
            { path: 'admin/finance', loadChildren: () => import('app/modules/admin/finance/finance.module').then(m => m.PaymentsModule) },
            { path: 'admin/stores', loadChildren: () => import('app/modules/admin/stores/store.module').then(m => m.StoresModule) },
            { path: 'admin/products', loadChildren: () => import('app/modules/admin/inventory/inventory.module').then(m => m.InventoryModule) },
            { path: 'admin/active-products', loadChildren: () => import('app/modules/admin/active-products/active-products.module').then(m => m.ActiveProductsModule) },
            { path: 'admin/connectors', loadChildren: () => import('app/modules/admin/third-party-connectors/third-party-connectors.module').then(m => m.ThirdPartyConnectorsModule) },

            { path: 'admin/productcategories', loadChildren: () => import('app/modules/admin/inventory/product-category/category.module').then(m => m.ProductCategoryModule) },
            { path: 'admin/productgroups', loadChildren: () => import('app/modules/admin/inventory/product-group/product-group.module').then(m => m.ProductGroupsModule) },
            { path: 'admin/customers', loadChildren: () => import('app/modules/admin/customers/customers.module').then(m => m.CustomersModule) },
            { path: 'admin/lenders', loadChildren: () => import('app/modules/admin/lenders/lenders.module').then(m => m.LendersModule) },
            { path: 'admin/couriers', loadChildren: () => import('app/modules/admin/couriers/couriers.module').then(m => m.CouriersModule) },
            { path: 'admin/users', loadChildren: () => import('app/modules/admin/users/users.module').then(m => m.UsersModule) },
            { path: 'admin/catchment', loadChildren: () => import('app/modules/admin/catchment/catchment.module').then(m => m.CatchmentModule) },
            { path: 'admin/accounting/invoicepaymentterms', loadChildren: () => import('app/modules/admin/accounting/invoice-payment-term/invoice-payment-term.module').then(m => m.InvoicePaymentTermModule) },
            { path: 'admin/suppliers', loadChildren: () => import('app/modules/admin/supplier/supplier.module').then(m => m.SuppliersModule) },
            { path: 'admin/marketing/adverts', loadChildren: () => import('app/modules/admin/marketing/advert.module').then(m => m.AdvertsModule) },
            { path: 'admin/communication', loadChildren: () => import('app/modules/admin/communication/communication.module').then(m => m.CommunicationsModule) },
            { path: 'admin/productbrands', loadChildren: () => import('app/modules/admin/inventory/product-brand/product-brand.module').then(m => m.ProductBrandsModule) },
            { path: 'admin/productmanufacturers', loadChildren: () => import('app/modules/admin/inventory/product-manufacturer/product-manufacturer.module').then(m => m.ProductManufacturerModule) },
            { path: 'admin/settings', loadChildren: () => import('app/modules/admin/settings/settings.module').then(m => m.SettingsModule) },
            { path: 'admin/orders', loadChildren: () => import('app/modules/admin/orders/orders.module').then(m => m.OrdersModule) },
            { path: 'admin/sale', loadChildren: () => import('app/modules/admin/analytics/analytics.module').then(m => m.AnalyticsModule) },
            { path: 'admin/documentation', loadChildren: () => import('app/modules/admin/documentation/documentation.module').then(m => m.DocumentationModule) },
            { path: 'admin/marketing/notifications', loadChildren: () => import('app/modules/admin/marketing/notifications/notifications.module').then(m => m.NotificationsModule) },
            { path: 'admin/routes', loadChildren: () => import('app/modules/admin/routes/routes.module').then(m => m.RoutesModule) },
            { path: 'admin/product-types', loadChildren: () => import('app/modules/admin/inventory/product-type/product-type.module').then(m => m.ProductTypesModule) },
            { path: 'admin/product-attributes', loadChildren: () => import('app/modules/admin/inventory/product-attribute/product-attribute.module').then(m => m.ProductAttributeModule) },
            { path: 'admin/actions', loadChildren: () => import('app/modules/admin/actions/actions.module').then(m => m.ActionsModule) },
            { path: 'admin/home', loadChildren: () => import('app/modules/admin/dashboard/home.module').then(m => m.DashboardModule) },
        ]
    },
    // 404 & Catch all
  //  { path: '**', redirectTo: 'admin/orders' }
];
