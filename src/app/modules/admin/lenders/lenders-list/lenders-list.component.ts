import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { LenderService } from '../lender.service';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'lenders-list',
  templateUrl: './lenders-list.component.html'
})
export class LendersListComponent implements OnInit {

  pageSize: number = 10;
  pageNumber: number = 0;
  displayedColumns: string[] = ['id', 'name', 'code', 'action'];
  dataSource: any;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
  errorMsg: any;
  totalAccounts: any;

  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

  constructor(
    private lender: LenderService
  ) { }

  ngOnInit() {
    this.getLenders();
  }
  getLenders() {
    this.isLoading.next(true);
    this.dataSource = new MatTableDataSource();
    this.lender.getAll(this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize)
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
    this.getLenders();
  }

  delete(id) {
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
        this.lender.deleteLender(id).subscribe(data => {
          if (data.status != 200) return;
          SWALMIXIN.fire({
            icon: 'success',
            title: 'Removed successfuly.',
          });
          this.getLenders();
        }, error => {
          SWALMIXIN.fire({
            icon: 'error',
            title: error.error.errorMessage,
          });
        });
      }
    });
  }
}
