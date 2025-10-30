import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseNavigationItem } from '@fuse/components/navigation';

@Component({
    selector: 'customer-detail',
    templateUrl: './customer-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerDetailComponent implements OnInit {

    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode = 'over';
    screenWidth:number=window.innerWidth;
    drawerOpened: boolean = true;
    
    menuData: FuseNavigationItem[];

    constructor(
        public dialog: MatDialog
    ) {
        this.menuData = [
            {
                id: 'customer',
                title: 'Customer',
                type: 'group',
                children: [
                    {
                        id: 'customer.detail',
                        title: 'Basic Details',
                        type: 'basic',
                        link: 'detail'
                    },
                    {
                        id: 'customer.address',
                        title: 'Addresses',
                        type: 'basic',
                        link: 'delivery-address'
                    },
                    {
                        id: 'customer.orders',
                        title: 'Orders',
                        type: 'basic',
                        link: 'orders'
                    },
                    {
                        id: 'customer.basket',
                        title: 'Basket',
                        type: 'basic',
                        link: 'basket'
                    },
                    {
                        id: 'customer.coupons',
                        title: 'Coupons',
                        type: 'basic',
                        link: 'coupons'
                    },
                    {
                        id: 'customer.affordability',
                        title: 'Affordability',
                        type: 'basic',
                        link: 'affordability'
                    },
                    {
                        id: 'customer.chat',
                        title: 'Get Insights',
                        type: 'basic',
                        link: 'insight'
                    }

                ]
            }
        ];
    }

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    ngOnInit() { }

}