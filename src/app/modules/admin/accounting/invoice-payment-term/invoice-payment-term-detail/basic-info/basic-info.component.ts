import { Component, NgZone, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { Location } from '@angular/common';
import { CatchmentArea } from 'app/models/catchmentarea';
import { InvoicePaymentTermDetailComponent } from '../invoice-payment-term-detail.component';
import { InvoicePaymentTermService } from '../../invoice-payment-term.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'basic-invoiceDetail',
    templateUrl: './basic-info.component.html'
})
export class InvoiceBasicDetailComponent implements OnInit {

    invoiceID: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    form: UntypedFormGroup;
    selectedCatchmentArea: CatchmentArea;
    formSubmitted: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: Router,
        public dialog: MatDialog,
        private invoiceComponent: InvoicePaymentTermDetailComponent,
        private location: Location,
        private invoiceService: InvoicePaymentTermService,
    ) {
        this.form = this.formBuilder.group({
            term: [null, Validators.compose([Validators.required])],
            description: [null, Validators.compose([Validators.required])],
        });
    }

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.invoiceID = Number(id[4]);
        if (this.invoiceID) this.loadInvoice();
    }

    loadInvoice() {
        this.isLoading.next(true);
        this.invoiceService.get(this.invoiceID).subscribe(data => {
            this.isLoading.next(false);
            this.form.patchValue({
                term: data.term,
                description: data.description
            });
        });
    }

    onSubmit() {
        if (this.invoiceID) this.updateInvoice();
        else this.createInvoice();
    }

    createInvoice() {
        this.formSubmitted = true;
        if(this.form.invalid) return;
        this.isLoading.next(true);
        this.form.value.id = 0;
        this.invoiceService.create(this.form.value).subscribe((data: any) => {
            this.isLoading.next(false);
            if(data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your invoice details have been saved.',
            });
            this.route.navigate(['/admin/accounting/invoicepaymentterms/', data.body.id]);
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    updateInvoice() {
        this.formSubmitted = true;
        if(this.form.invalid) return;
        this.isLoading.next(true);
        this.invoiceService.update(this.invoiceID, this.form.value).subscribe((data: any) => {
            this.isLoading.next(false);
            if(data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your invoice has been updated.',
            });
            this.loadInvoice();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    toggleDrawer() {
        this.invoiceComponent.matDrawer.toggle();
    }
}