import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { OrdersService } from './orders.service';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
    title = 'Orders | bsktpay';
    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['account', 'val', 'store', 'status', 'action'];
    dataSource: any;
    errorMsg: any;
    totalAccounts: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    startDate: any;
    endDate: any;
    orderStatus: any;

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private orderService: OrdersService,
        private titleService: Title
    ) { }

    dateRange = new UntypedFormGroup({
        start: new UntypedFormControl(moment()),
        end: new UntypedFormControl(moment())
    });
    

    ngOnInit() {
        this.getData();
        this.titleService.setTitle(this.title);
    }

    getData() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.orderService.getAll(this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize, this.startDate, this.endDate, this.orderStatus)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            ).subscribe((data: any) => {
                this.dataSource.data = data.data;
                this.dataSource.paginator = this.paginator;
                this.totalAccounts = data.totalSize;
            }, error => {
                this.isLoading.next(false);
                this.errorMsg = error.message;
            })
    }

    paginate(event: PageEvent) {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getData();
    }

    applyFilter() {
        this.startDate = moment(this.dateRange.value.start).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        this.endDate = moment(this.dateRange.value.end).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        if(this.startDate == this.endDate) {
            this.startDate = null;
            this.endDate = null;
        }
        this.getData();
    }

    clearFilter() {
        this.startDate = null;
        this.endDate = null;
        this.dateRange.reset();
        this.orderStatus = null;
        this.getData();
    }

}