import { Component, OnInit } from '@angular/core';
import { FinanceService } from '../finance.service';
import { BasicActions } from 'app/shared/basic-actions';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
    selector: 'app-applications',
    templateUrl: './applications.component.html',
})
export class ApplicationsComponent extends BasicActions implements OnInit {
    dataSource:any=[];
    errorMsg;

    displayedColumns: string[] = ['date', 'fullName', 'loanTerm', 'deposit', 'reference',];

    constructor(
        private financeService: FinanceService,
        private router:Router
    ) {
        super('');
    }

    ngOnInit(): void {
        this.getApplicationsData();
    }

    getApplicationsData() {
        this.financeService
            .getApplications( this.filterOptions.page+1, this.filterOptions.limit)
            .subscribe({
                next: (resp: any) => {
                    this.dataSource = resp.data;
                },
                error: (err) => {
                    this.errorMsg=err?.error?.message||err.message
                },
            });
    }

    public paginate(event: PageEvent): void {
        this.filterOptions.limit = event.pageSize;
        this.filterOptions.page = event.pageIndex;
        this.getApplicationsData();
    }

    selectedApplication(row){
      this.financeService.applicationData.next(row);
      this.router.navigate([`/admin/finance/application/${row.id}`])
    }

  }