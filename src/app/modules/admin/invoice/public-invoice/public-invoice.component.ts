import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { CustomerService } from '../../customers/customer.service';
import { BusinessAccountService } from '../../business-accounts/business-account.service';

@Component({
    selector: 'app-public-invoice',
    templateUrl: './public-invoice.component.html',
    styleUrls: ['./public-invoice.component.scss'],
})
export class PublicInvoiceComponent implements OnInit {
    orderId: any;
    orderData;
    businessAccount: any;
    bankDetails: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();

    constructor(
        private activateRoute: ActivatedRoute,
        private customerService: CustomerService,
        private cdr: ChangeDetectorRef,
        private businessService: BusinessAccountService
    ) {}
    ngOnInit(): void {
        this.activateRoute.params.subscribe((params) => {
            if (params?.id) {
                this.orderId = params?.id;
                this.loadData();
            }
        });
    }

    loadData() {
        this.isLoading.next(true);
        this.businessService
            .getBusinessAccount()
            .subscribe((data) => (this.businessAccount = data));
        this.customerService
            .orderDetail(this.orderId)
            .subscribe((data: any) => {
                this.orderData = data;
                this.cdr.detectChanges();
                this.isLoading.next(false);
            });

        this.businessService.getBusinessBankAccount().subscribe(
            (data) => {
                this.bankDetails=data;
            }
        );
    }
}
