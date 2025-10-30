import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommunicationService } from '../communication.service';

@Component({
    selector: 'communication-list',
    templateUrl: './communication-list.component.html'
})
export class CommunicationsListComponent implements OnInit {

    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['account', 'name', 'email', 'action'];
    dataSource: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    errorMsg: any;
    totalAccounts: any;

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private communicationService: CommunicationService
    ) { }

    ngOnInit() {
        this.getCouriers();
    }

    getCouriers() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.communicationService.getServices(this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize)
        .subscribe(data => {
            this.isLoading.next(false);
            this.dataSource.data = data.body;
            this.dataSource.paginator = this.paginator;
            this.totalAccounts = data.body.length;
        }, error => {
            this.isLoading.next(false);
            this.errorMsg = error.message;
        })
    }

    paginate(event: PageEvent) {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getCouriers();
    }
}