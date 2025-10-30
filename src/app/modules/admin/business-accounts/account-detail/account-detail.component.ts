import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { Title } from '@angular/platform-browser';
import { FuseNavigationItem } from '@fuse/components/navigation';

@Component({
    selector: 'accountDetail',
    templateUrl: './account-detail.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountDetailComponent implements OnInit {
    title = 'Business Account | bsktpay';
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    screenWidth:number=window.innerWidth;
    drawerOpened: boolean = true;
    menuData: FuseNavigationItem[];

    constructor(
        public dialog: MatDialog,
        private titleService: Title
    ) {
        this.menuData = [
            {
                id: 'ba',
                title: 'Business Account',
                type: 'group',
                children: [
                    {
                        id: 'ba.detail',
                        title: 'Basic Details',
                        type: 'basic',
                        link: 'basic'
                    },
                    {
                        id: 'ba.stores',
                        title: 'Stores',
                        type: 'basic',
                        link: 'stores'
                    },
                    {
                        id: 'ba.collaborators',
                        title: 'Collaborators',
                        type: 'basic',
                        link: 'collaborators'
                    },
                    {
                        id: 'ba.bank',
                        title: 'Bank Details',
                        type: 'basic',
                        link: 'bank-details'
                    },
                    {
                        id: 'ba.payments',
                        title: 'Developer Apps',
                        type: 'basic',
                        link: 'developer-apps'
                    },
                    {
                        id: 'ba.webHoook',
                        title: 'Webhook',
                        type: 'basic',
                        link: 'webhooks'
                    },
                    {
                        id: 'ba.tax',
                        title: 'Tax',
                        type: 'basic',
                        link: 'tax'
                    },
                ]
            }
        ];
    }

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    ngOnInit(): void {
        this.titleService.setTitle(this.title);
     }

}