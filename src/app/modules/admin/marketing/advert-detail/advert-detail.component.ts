import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseNavigationItem } from '@fuse/components/navigation';

@Component({
    selector: 'advert-detail',
    templateUrl: './advert-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvertDetailComponent implements OnInit {

    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode = 'side';
    drawerOpened: boolean = true;
    menuData: FuseNavigationItem[];

    constructor(
        public dialog: MatDialog
    ) {
        this.menuData = [
            {
                id: 'advert',
                title: 'Advert',
                type: 'group',
                children: [
                    {
                        id: 'advert.detail',
                        title: 'Basic Details',
                        type: 'basic',
                        link: 'basic'
                    },
                
                    {
                        id: 'advert.media',
                        title: 'Media',
                        type: 'basic',
                        link: 'media'
                    }
                ]
            }
        ];
    }

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    ngOnInit() { }

}