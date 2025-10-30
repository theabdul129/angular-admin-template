import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FinanceService } from '../../finance.service';
import { BasicActions } from 'app/shared/basic-actions';

@Component({
    selector: 'app-consent-application',
    templateUrl: './consent-application.component.html',
    styleUrls: ['./consent-application.component.scss'],
})
export class ConsentApplicationComponent extends BasicActions {
    data: any;
    @Input() applicationId;
    errorMsg;
    displayedColumns: string[] = [
        'userAgent',
        'consentType',
        'submittedAt',
        'submittedByIp',
    ];
    constructor(private financeService: FinanceService) {
      super('')
    }

    ngOnInit(): void {
        this.getConsentData(this.applicationId);
    }

    getConsentData(id) {
        if (this._subscriptions?.getData)
            this._subscriptions.getData.unsubscribe();
        this._subscriptions.getData = this.financeService
            .getConsentData(id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (resp: any) => {
                    this.data = resp;
                },
                error: (err) => {
                    this.errorMsg = err?.error?.message || err?.message;
                },
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        if (this._subscriptions.getData) {
            this._subscriptions.getData.unsubscribe();
        }
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
