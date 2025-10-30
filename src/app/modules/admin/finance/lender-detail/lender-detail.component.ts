import { Component, OnInit } from '@angular/core';
import { FinanceService } from '../finance.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-lender-detail',
    templateUrl: './lender-detail.component.html',
    styleUrls:['./lender-detail.component.scss']
})
export class LenderDetailComponent implements OnInit {
    lenderData;
    applicants;
    activeTab:any
    constructor(
        private financeService: FinanceService,
        private router: Router,
        private activatedRoute:ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.getSelectedLenderData();
        this.activatedRoute.queryParams.subscribe(params=>{
            if(params?.tab){
                this.activeTab=(Number(params.tab)-1);
            }
        })
    }

    getSelectedLenderData() {
        this.financeService.lenderData.subscribe((res) => {
            this.lenderData = res;
            if (!this.lenderData) this.router.navigateByUrl('/admin/finance');
            this.financeService.getApplicants(this.lenderData?.id).subscribe({
                next: (resp) => {
                    this.applicants = resp;
                }
            });
        });
    }
}
