/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'administration',
        title: 'Administration',
        type: 'group',
        children: [
            {
                id: 'authenication.dashboard',
                title: 'Home',
                type: 'basic',
                link: 'admin/home',
                icon: 'heroicons_outline:home',
            },
            {
                id: 'administration.inventory',
                title: 'Inventory',
                type: 'collapsable',
                icon: 'heroicons_outline:shopping-cart',
                children: [
                    {
                        id: 'inventory.productattr',
                        title: 'Products',
                        type: 'basic',
                        link: 'admin/products',
                    },
                    // {
                    //     id: 'inventory.productattr',
                    //     title: 'Attributes',
                    //     type: 'basic',
                    //     link: 'admin/product-attributes',
                    // },
                
                    {
                        id: 'inventory.productcategories',
                        title: 'Categories',
                        type: 'basic',
                        link: 'admin/productcategories',
                    }                  
                ],
            },
            {
                id: 'orders.orders',
                        title: 'Orders',
                        type: 'basic',
                        link: '/admin/orders',
                icon: 'heroicons_outline:color-swatch',
            },
           {
                id: 'authenication.customers',
                title: 'Customers',
                type: 'basic',
                link: 'admin/customers',
                icon: 'heroicons_outline:users',
            },
            {
                id: 'product.active',
                title: 'Active Products',
                type: 'basic',
                link: 'admin/active-products',
                icon: 'heroicons_outline:shopping-bag',
            },
            // {
            //     id: 'manage.stores',
            //     title: 'Stores',
            //     type: 'basic',
            //     link: '/admin/stores',
            //     icon: 'heroicons_outline:shopping-cart',
            // },
            {
                id: 'manage.businessaccounts',
                title: 'Business Account',
                type: 'basic',
                link: 'admin/business-account',
                icon: 'heroicons_outline:briefcase',
            },
            {
                id: 'manage.payments',
                title: 'Lender Panel',
                type: 'basic',
                link: 'admin/finance',
                icon: 'heroicons_outline:banknotes',
            },
            {
                id: 'accounting.connectors',
                title: 'Data Sources',
                link: 'admin/connectors',
                type: 'basic',
                icon: 'heroicons_outline:cog',
                
            },
        ],
    },
    {
        id: 'help',
        title: 'Help',
        type: 'group',
        children: [
            {
                id: 'help.doc',
                title: 'Documentation',
                type: 'basic',
                link: 'admin/documentation',
                icon: 'heroicons_outline:clipboard-list',
            }
        ]
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
    },
];
