import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NotificationsService } from './notifications.service';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {

    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['account', 'val', 'edit', 'action'];
    dataSource: any;
    errorMsg: any;
    totalAccounts: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private notifications: NotificationsService
    ) { }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.notifications.getAll(this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize)
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
}