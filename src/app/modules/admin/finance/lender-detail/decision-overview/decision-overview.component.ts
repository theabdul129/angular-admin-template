import { Component, Input, OnInit } from '@angular/core';
import { FinanceService } from '../../finance.service';
import { takeUntil } from 'rxjs';
import { BasicActions } from 'app/shared/basic-actions';

@Component({
  selector: 'app-decision-overview',
  templateUrl: './decision-overview.component.html',
  styleUrls: ['./decision-overview.component.scss']
})
export class DecisionOverviewComponent extends BasicActions implements OnInit {
  @Input() dataId : any;
  decision:any;
  errorMsg

  constructor(private financeService:FinanceService) { 
    super('');
  }

  ngOnInit(): void {
    this.getDecisionOverviewDetails();
  }

  getDecisionOverviewDetails(){
    this.financeService.getDecision(this.dataId)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe({
      next:(resp)=>{
        this.decision=resp;
      },
      error:(err)=>{
        this.errorMsg=err?.error?.message || err?.message
      }
    });
  }
}
