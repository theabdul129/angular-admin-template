import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { BasicActions } from 'app/shared/basic-actions';
import { takeUntil } from 'rxjs/operators';
import { FinanceService } from '../finance.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html'
})
export class PaymentDetailsComponent extends BasicActions implements OnInit,OnDestroy {
  @Input() id:number=null; 
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['paymentIntentId', 'fundsReceivedAt', 'fundsReceivedAmount'];
  dataSource: any;
  errorMsg: any;

  constructor(private financeService: FinanceService, private activatedRoute: ActivatedRoute) { 
    super("");
  }

  ngOnInit(): void {
    if(this.id)this.getPayments(this.id)
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  getPayments(id) {
    this.loading(true);
    this.dataSource = new MatTableDataSource();
    this.financeService.getPaymentsByBeneficiaryId(id,this.filterOptions.page,this.filterOptions.limit)
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
    this.getPayments(this.id);
  }
}
