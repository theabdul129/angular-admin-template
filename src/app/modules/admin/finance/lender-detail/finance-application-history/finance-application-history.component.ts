import { FinanceService } from './../../finance.service';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-finance-application-history',
    templateUrl: './finance-application-history.component.html',
    styleUrls: ['./finance-application-history.component.scss'],
})
export class FinanceApplicationHistoryComponent {
    @Input() applicationId: any;
    historiesData;
    errorMsg
    constructor(private financeService: FinanceService) {}

    ngOnInit(): void {
        this.getHistoryStatus(this.applicationId);
    }

    getHistoryStatus(appId) {
        this.financeService.getApplicationsStatuses(appId).subscribe({
            next: (resp: any) => {
                this.historiesData = resp;
            },
            error: (err) => {this.errorMsg=err?.error?.message || err?.message},
        });
    }
}
