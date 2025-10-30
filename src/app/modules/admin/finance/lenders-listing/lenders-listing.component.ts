import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BasicActions } from 'app/shared/basic-actions';
import { takeUntil } from 'rxjs/operators';
import { FinanceService } from '../finance.service';

@Component({
  selector: 'app-payments',
  templateUrl: './lenders-listing.component.html',
  styleUrls: ['./lenders-listing.component.scss'],
})
export class LendersListingComponent extends BasicActions  implements OnInit {
  displayedColumns: string[] = ['id', 'name','lender', 'city'];
  dataSource: any;
  errorMsg: any;
  totalAccounts: any;
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

  constructor(
    private financeService: FinanceService,
    private router: Router
  ) {
    super("")
  }

  ngOnInit(): void {
    this.getAllLenders();
  }

  getAllLenders() {
    this.loading(true)
    this.dataSource = new MatTableDataSource();
    this.financeService.getAllLenders(this.filterOptions.page,this.filterOptions.limit)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.loading(false);
        this.dataSource.data = data.data;
        this.tableAttributes.totalRecords=data.totalSize;
      }, error => {
        this.loading(false);
        this.errorMsg = error.message;
      })
  }

  paginate(event: PageEvent) {
    this.filterOptions.page = event.pageIndex;
    this.filterOptions.limit = event.pageSize;
    this.getAllLenders();
  }

  viewPayments(data) {
      this.router.navigateByUrl('/admin/finance/detail/'+ data.id);
      this.financeService.lenderData.next(data);
  }

}
