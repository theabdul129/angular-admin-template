import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseNavigationItem } from '@fuse/components/navigation';

@Component({
    selector: 'storeDetail',
    templateUrl: './store-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoreDetailComponent implements OnInit {

    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode = 'side';
    drawerOpened: boolean = true;
    menuData: FuseNavigationItem[];

    constructor(
        public dialog: MatDialog
    ) {
        this.menuData = [
            {
                id: 'store',
                title: 'Store',
                type: 'group',
                children: [
                    {
                        id: 'store.detail',
                        title: 'Basic Details',
                        type: 'basic',
                        link: 'basic'
                    },
                    {
                        id: 'store.collaborators',
                        title: 'Collaborators',
                        type: 'basic',
                        link: 'collaborators'
                    },
                    {
                        id: 'store.other',
                        title: 'Inventory',
                        type: 'basic',
                        link: 'inventory'
                    },
                    {
                        id: 'store.other',
                        title: 'File Manager',
                        type: 'basic',
                        link: 'upload-product-file'
                    },
                    {
                        id: 'store.other',
                        title: 'API Access',
                        type: 'basic',
                        link: 'api'
                    },
                    {
                        id: 'store.stock',
                        title: 'Stock Adjustments',
                        type: 'basic',
                        link: 'stock-adjustments'
                    },
                    {
                        id: 'store.opening',
                        title: 'Opening Hours',
                        type: 'basic',
                        link: 'opening-hours'
                    },
                    {
                        id: 'store.other',
                        title: 'Other Info',
                        type: 'basic',
                        link: 'other'
                    }
                ]
            }
        ];
    }

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    ngOnInit() { }

}