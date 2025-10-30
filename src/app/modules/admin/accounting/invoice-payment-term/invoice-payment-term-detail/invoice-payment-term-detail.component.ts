import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseNavigationItem } from '@fuse/components/navigation';

@Component({
    selector: 'invoice-payment-term-detail',
    templateUrl: './invoice-payment-term-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicePaymentTermDetailComponent implements OnInit {

    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode = 'side';
    drawerOpened: boolean = true;
    menuData: FuseNavigationItem[];

    constructor(
        public dialog: MatDialog
    ) {
        this.menuData = [
            {
                id: 'invoice',
                title: 'Invoice Term',
                type: 'group',
                children: [
                    {
                        id: 'invoice.detail',
                        title: 'Basic Details',
                        type: 'basic',
                        link: 'basic'
                    }
                ]
            }
        ];
    }

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    ngOnInit() { }

}