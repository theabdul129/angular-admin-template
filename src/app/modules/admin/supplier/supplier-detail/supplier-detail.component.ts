import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseNavigationItem } from '@fuse/components/navigation';

@Component({
    selector: 'supplier-detail',
    templateUrl: './supplier-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupplierDetailComponent implements OnInit {

    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode = 'side';
    drawerOpened: boolean = true;
    menuData: FuseNavigationItem[];

    constructor(
        public dialog: MatDialog
    ) {
        this.menuData = [
            {
                id: 'supplier',
                title: 'Supplier',
                type: 'group',
                children: [
                    {
                        id: 'supplier.detail',
                        title: 'Basic Details',
                        type: 'basic',
                        link: 'basic'
                    },
                    {
                        id: 'supplier.terms',
                        title: 'Invoice Terms',
                        type: 'basic',
                        link: 'invoice-terms'
                    },
                    {
                        id: 'supplier.products',
                        title: 'Products',
                        type: 'basic',
                        link: 'products'
                    },
                    {
                        id: 'supplier.contact',
                        title: 'Contacts',
                        type: 'basic',
                        link: 'contacts'
                    }
                ]
            }
        ];
    }

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    ngOnInit() { }

}