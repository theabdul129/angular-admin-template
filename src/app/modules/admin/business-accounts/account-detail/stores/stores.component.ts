import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { BusinessAccountService } from '../../business-account.service';
import { AccountDetailComponent } from '../account-detail.component';

@Component({
    selector: 'account-stores',
    templateUrl: './stores.component.html'
})
export class AccountStoresComponent implements OnInit {

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['id', 'name', 'city', 'action'];
    dataSource: any;
    errorMsg: any;
    totalAccounts: any;
    accountId: any;

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private businessService: BusinessAccountService,
        private route: Router,
        private accountComponent: AccountDetailComponent,
        private ngZone: NgZone,
        private cdr:ChangeDetectorRef
    ) { }

    ngOnInit() {
        if(window.innerWidth<769)this.toggleDrawer();
        let businessAccountId = this.route.url.split(['/'][0]);
        this.accountId = businessAccountId[4];
        this.getStores();
    }

    getStores() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.businessService.getAllByBusinessAccount(this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize, this.accountId)
            .subscribe((data) => {
                this.ngZone.run(() => {
                    this.isLoading.next(false);
                    this.totalAccounts = data.totalSize;
                    this.dataSource.data = data.data;
                    this.dataSource.paginator = this.paginator;
                })
                this.cdr.detectChanges();
            }, error => {
                this.isLoading.next(false);
                this.errorMsg = error.message;
                this.cdr.detectChanges();
            })
    }

    toggleDrawer() {
        this.accountComponent.matDrawer.toggle();
    }

    paginate(event: PageEvent) {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getStores();
    }

}