import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { TaxService } from '../tax.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AccountDetailComponent } from '../../account-detail/account-detail.component';

@Component({
    selector: 'tax-list',
    templateUrl: './tax-list.component.html'
})
export class TaxListComponent implements OnInit {

    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['id', 'name', 'rate', 'country', 'created', 'action'];
    dataSource: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    errorMsg: any;
    totalAccounts: any;

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private taxService: TaxService,
        private accountComponent: AccountDetailComponent,
    ) { }

    ngOnInit() {
        if(window.innerWidth<769)this.toggleDrawer();
        this.getTaxes();
    }

    getTaxes() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.taxService.getAll(this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize)
            .subscribe((data: any) => {
                this.dataSource.data = data.data;
                this.dataSource.paginator = this.paginator;
                this.totalAccounts = data.totalSize;
                this.isLoading.next(false);
            }, error => {
                this.isLoading.next(false);
                this.errorMsg = error.message;
            })
    }

    paginate(event: PageEvent) {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getTaxes();
    }

    /**
     * Toggle Drawer
     */
    public toggleDrawer() {
        this.accountComponent.matDrawer.toggle();
    }
}