import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { InvoicePaymentTermService } from 'app/modules/admin/accounting/invoice-payment-term/invoice-payment-term.service';
import { BusinessAccountService } from 'app/modules/admin/business-accounts/business-account.service';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { SuppliersService } from '../../supplier.service';
import { SupplierDetailComponent } from '../supplier-detail.component';

@Component({
    selector: 'suppliers-terms',
    templateUrl: './invoice-terms.component.html',
})
export class SupplierInvoiceTermsComponent implements OnInit {
    
    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = [
        'name',
        'created',
        'paymentTerm',
        'action',
    ];
    dataSource: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    errorMsg: any;
    totalAccounts: any;
    supplierId: any;
    form: UntypedFormGroup;
    selectedTerm: any;
    paymentTerms: any;
    businessAccounts: any;
    formSubmitted: boolean = false;

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private supplierService: SuppliersService,
        private route: Router,
        private location: Location,
        private supplierComponent: SupplierDetailComponent,
        private dialog: MatDialog,
        private formBuilder: UntypedFormBuilder,
        private invoicePaymentTermService: InvoicePaymentTermService,
        private business: BusinessAccountService
    ) {
        this.form = this.formBuilder.group({
            accountNumber: ['', Validators.compose([Validators.required])],
            businessAccount: ['', Validators.compose([Validators.required])],
            paymentTerm: ['', Validators.compose([Validators.required])],
            notes: '',
        });
    }

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.supplierId = Number(id[3]);
        if (this.supplierId) this.getTerms();
        // else this.location.back();
        this.getPaymentTerms();
        this.getBusinessAccount();
    }

    getTerms() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.supplierService
            .getTerms(
                this.supplierId,
                this.paginator ? this.paginator.pageIndex : this.pageNumber,
                this.paginator ? this.paginator.pageSize : this.pageSize
            )
            .subscribe(
                (data: any) => {
                    this.dataSource.data = data.data;
                    this.dataSource.paginator = this.paginator;
                    this.totalAccounts = data.totalSize;
                    this.isLoading.next(false);
                },
                (error) => {
                    this.isLoading.next(false);
                    this.errorMsg = error.message;
                }
            );
    }

    paginate(event: PageEvent) {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getTerms();
    }

    toggleDrawer() {
        this.supplierComponent.matDrawer.toggle();
    }

    openTerm(modal, data) {
        this.selectedTerm = data;
        if (this.selectedTerm) {
            this.form.patchValue({
                accountNumber: this.selectedTerm.accountNumber,
                businessAccount: this.selectedTerm.businessAccount.id,
                paymentTerm: this.selectedTerm.paymentTerm.id,
                notes: this.selectedTerm.notes,
            });
        } else this.form.reset();
        this.dialog.open(modal, { width: '650px' });
    }

    closeModal() {
        this.selectedTerm = null;
        this.dialog.closeAll();
    }

    getPaymentTerms() {
        this.invoicePaymentTermService.getAll(0, 500).subscribe((data) => {
            console.log(data.data);

            this.paymentTerms = data.data;
        });
    }

    getBusinessAccount() {
        this.business
            .getBusinessAccounts(0, 500)
            .subscribe((data) => (this.businessAccounts = data.data));
    }

    onSubmit() {
        this.selectedTerm ? this.updateData() : this.saveData();
    }

    saveData() {
        this.formSubmitted = true;
        if (this.form.invalid) return;
        this.isLoading.next(true);
        this.form.value.id = 0;
        this.form.value.businessAccount = {
            id: this.form.value.businessAccount,
        };
        this.form.value.paymentTerm = { id: this.form.value.paymentTerm };
        this.supplierService
            .createTerm(this.supplierId, this.form.value)
            .subscribe(
                (data: any) => {
                    this.isLoading.next(false);
                    if (data.status != 200) return;
                    this.getTerms();
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Your term details have been saved.',
                    });
                    this.dialog.closeAll();
                },
                (error) => {
                    this.isLoading.next(false);
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                }
            );
    }

    updateData() {
        this.formSubmitted = true;
        if (this.form.invalid) return;
        this.isLoading.next(true);
        this.form.value.id = 0;
        this.form.value.businessAccount = {
            id: this.form.value.businessAccount,
        };
        this.form.value.paymentTerm = { id: this.form.value.paymentTerm };
        this.supplierService
            .updateTerm(this.supplierId, this.selectedTerm.id, this.form.value)
            .subscribe(
                (data: any) => {
                    this.isLoading.next(false);
                    if (data.status != 200) return;
                    this.getTerms();
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Your invoice term has been updated.',
                    });
                },
                (error) => {
                    this.isLoading.next(false);
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                }
            );
    }

    removeTerm(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                this.isLoading.next(true);
                this.supplierService.deleteTerm(this.supplierId, id).subscribe(
                    (data: any) => {
                        this.isLoading.next(false);
                        if (data.status != 200) return;
                        SWALMIXIN.fire({
                            icon: 'success',
                            title: 'Removed successfuly.',
                        });
                        this.getTerms();
                    },
                    (error) => {
                        this.isLoading.next(false);
                        SWALMIXIN.fire({
                            icon: 'error',
                            title: error.error.errorMessage,
                        });
                    }
                );
            }
        });
    }
}
