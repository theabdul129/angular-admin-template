import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseNavigationItem } from '@fuse/components/navigation';

@Component({
    selector: 'productCategory-detail',
    templateUrl: './category-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCategoryDetailComponent implements OnInit {

    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    screenWidth:number=window.innerWidth;
    drawerOpened: boolean = true;
    menuData: FuseNavigationItem[];

    constructor(
        public dialog: MatDialog
    ) {
        this.menuData = [
            {
                id: 'product',
                title: 'Product Category',
                type: 'group',
                children: [
                    {
                        id: 'product.detail',
                        title: 'Basic Details',
                        type: 'basic',
                        link: 'basic'
                    },
                    {
                        id: 'product.images',
                        title: 'Product Images',
                        type: 'basic',
                        link: 'images'
                    },
                    {
                        id: 'product.procat',
                        title: 'Product Categories',
                        type: 'basic',
                        link: 'product-categories'
                    },
                    {
                        id: 'product.relcat',
                        title: 'Related Categories',
                        type: 'basic',
                        link: 'related-categories'
                    }
                ]
            }
        ];
    }

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    ngOnInit() { }

}