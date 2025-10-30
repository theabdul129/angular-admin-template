import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerService } from '../customer.service';

@Component({
    selector: 'customers-list',
    templateUrl: './customers-list.component.html'
})
export class CustomersListComponent implements OnInit {

    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['id', 'name', 'action'];
    dataSource: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    errorMsg: any;
    totalAccounts: any;

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private customerService: CustomerService
    ) { }

    ngOnInit() {
        this.getCustomers();
    }

    getCustomers() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.customerService.getAll(this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize)
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
        this.getCustomers();
    }
}