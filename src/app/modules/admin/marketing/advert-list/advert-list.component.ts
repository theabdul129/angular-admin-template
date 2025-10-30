import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AdvertService } from '../advert.service';

@Component({
    selector: 'advert-list',
    templateUrl: './advert-list.component.html'
})
export class AdvertListComponent implements OnInit {

    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['id', 'image', 'name', 'title', 'contentLocation', 'status', 'action'];
    dataSource: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    errorMsg: any;
    totalAccounts: any;

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private advertService: AdvertService
    ) { }

    ngOnInit() {
        this.getAdverts();
    }

    getAdverts() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.advertService.getAll(this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize)
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
        this.getAdverts();
    }

    deleteAdvert(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.isLoading.next(true);
                this.advertService.delete(id).subscribe((data: any) => {
                    this.isLoading.next(false);
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Removed successfuly.',
                    });
                    this.getAdverts();
                }, error => {
                    this.isLoading.next(false);
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                });
            }
        });
    }
}