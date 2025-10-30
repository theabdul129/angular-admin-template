import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FinanceService } from '../../finance.service';

@Component({
    selector: 'app-application-detail',
    templateUrl: './application-detail.component.html',
    styleUrls: ['./application-detail.component.scss'],
})
export class ApplicationDetailComponent implements OnInit{
    application;
    applicants;
    applicationId: number;
    private _unsubscribeAll: Subject<any> = new Subject(); // for unsbscribe the on leaving the component
    lenderData:any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private financeService: FinanceService,
    ) {}

    ngOnInit(): void {

      this.activatedRoute.params.subscribe(params=>{
        this.applicationId=params.appId;
        this.financeService.getApplicants(this.applicationId)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: (resp) => {
              this.applicants = resp;
          }
        });
      })

      this.financeService.applicationData.subscribe(application=>{
        if(!application) this.router.navigateByUrl("/admin/finance")
        this.application=application;
      });

      this.financeService.lenderData.subscribe(data=>{
        this.lenderData=data;
      })

    }

    
    ngOnDestroy(): void {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
    }

    /**
     * Back to Applications
     */
    backToApplications(){
      this.router.navigate([`/admin/finance/detail/${this.lenderData?.id}`],{queryParams:{tab:3}})
    } 
}
