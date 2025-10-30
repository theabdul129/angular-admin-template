import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseNavigationItem } from '@fuse/components/navigation';

@Component({
    selector: 'courier-detail',
    templateUrl: './couriers-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourierrDetailComponent implements OnInit {

    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode = 'side';
    drawerOpened: boolean = true;
    menuData: FuseNavigationItem[];

    constructor(
        public dialog: MatDialog
    ) {
        this.menuData = [
            {
                id: 'courier',
                title: 'Couriers',
                type: 'group',
                children: [
                    {
                        id: 'courier.detail',
                        title: 'Basic Details',
                        type: 'basic',
                        link: 'basic'
                    },
                    {
                        id: 'courier.qr',
                        title: 'QR Code',
                        type: 'basic',
                        link: 'qr-code'
                    }
                ]
            }
        ];
    }

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    ngOnInit() { }

}