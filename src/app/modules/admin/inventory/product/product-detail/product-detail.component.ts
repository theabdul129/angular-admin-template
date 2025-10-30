import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseNavigationItem } from '@fuse/components/navigation';

@Component({
    selector: 'product-detail',
    templateUrl: './product-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnInit {

    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    screenWidth:number=window.innerWidth
    drawerOpened: boolean = true;
    menuData: FuseNavigationItem[];

    constructor(
        public dialog: MatDialog
    ) {
        this.menuData = [
            {
                id: 'product',
                title: 'Product',
                type: 'group',
                children: [
                    {
                        id: 'product.detail',
                        title: 'Basic Details',
                        type: 'basic',
                        link: 'basic'
                    },
                    {
                        id: 'product.collaborators',
                        title: 'Images',
                        type: 'basic',
                        link: 'images'
                    },
                    {
                        id: 'product.info',
                        title: 'Attributes',
                        type: 'basic',
                        link: 'more-information'
                    },
                    {
                        id: 'product.code',
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