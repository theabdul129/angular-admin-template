import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { BusinessAccountService } from '../../business-account.service';
import { AccountDetailComponent } from '../account-detail.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'account-collaborators',
    templateUrl: './collaborators.component.html'
})
export class AccountCollaboratorsComponent implements OnInit {

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    accountId: any;
    accountData: any;

    constructor(
        private accountComponent: AccountDetailComponent,
        private businessService: BusinessAccountService,
        private route: Router,
        public dialog: MatDialog,
        private ngZone: NgZone,
        private cdr:ChangeDetectorRef
    ) { }

    ngOnInit() {
        if(window.innerWidth<769)this.toggleDrawer();
        let businessAccountId = this.route.url.split(['/'][0]);
        this.accountId = businessAccountId[4];
        if (this.accountId) this.getAccountDetails(this.accountId);
    }

    getAccountDetails(accountId) {
        this.isLoading.next(true);
        this.businessService.getBusinessAccount().subscribe(data => {
            this.ngZone.run(() => {
                this.accountData = data;
                this.cdr.detectChanges()
                this.isLoading.next(false);
            })
        })
    }

    toggleDrawer() {
        this.accountComponent.matDrawer.toggle();
    }

}