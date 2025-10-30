import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { SuppliersService } from '../../supplier.service';
import { SupplierDetailComponent } from '../supplier-detail.component';

@Component({
    selector: 'delivery-terms',
    templateUrl: './delivery-terms.component.html'
})
export class DeliveryTermsComponent implements OnInit {

    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['id', 'name', 'created', 'from', 'to', 'action'];
    dataSource: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    errorMsg: any;
    totalAccounts: any;
    supplierId: any;
    form: UntypedFormGroup;
    termId: any;
    selectedTerm: any;
    currencyList = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'SGD', 'CHF', 'MYR', 'JPY', 'CNY'];
    formSubmitted: boolean = false;

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private supplierService: SuppliersService,
        private route: Router,
        private location: Location,
        private supplierComponent: SupplierDetailComponent,
        private dialog: MatDialog,
        private formBuilder: UntypedFormBuilder
    ) {
        this.form = this.formBuilder.group({
            sku: ['', Validators.compose([Validators.required])],
            unitPrice: ['', Validators.compose([Validators.required])],
            validFrom: [''],
            validTo: [''],
            description: [''],
            currency: ['', Validators.required]
        });
    }

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.supplierId = Number(id[3]);
        this.termId = Number(id[5]);
        if (this.supplierId) this.getTerms();
        // else this.location.back();
    }

    getTerms() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.supplierService.getDeliveryTerms(this.supplierId, this.termId, this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize)
            .subscribe((data: any) => {
                this.isLoading.next(false);
                this.dataSource.data = data.data;
                this.dataSource.paginator = this.paginator;
                this.totalAccounts = data.totalSize;
            }, error => {
                this.isLoading.next(false);
                this.errorMsg = error.message;
            })
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
                sku: this.selectedTerm.sku,
                unitPrice: this.selectedTerm.unitPrice / 100,
                validFrom: this.selectedTerm.validFrom,
                validTo: this.selectedTerm.validTo,
                description: this.selectedTerm.description,
                currency: this.selectedTerm.currency
            })
        } else this.form.reset();
        this.dialog.open(modal, { width: '650px' });
    }

    closeModal() {
        this.dialog.closeAll();
    }

    onSubmit() {
        this.selectedTerm ? this.updateData() : this.saveData();
    }

    saveData() {
        this.formSubmitted = true;
        if(this.form.invalid) return;
        this.isLoading.next(true);
        this.form.value.unitPrice = this.form.value.unitPrice * 100;
        this.supplierService.createDeliveryTerm(this.supplierId, this.termId, this.form.value).subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your delivery term details have been saved.',
            });
            this.dialog.closeAll();
            this.getTerms();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    updateData() {
        this.formSubmitted = true;
        if(this.form.invalid) return;
        this.isLoading.next(true);
        this.form.value.id = this.selectedTerm.id;
        this.supplierService.updateDeliveryTerm(this.supplierId, this.termId, this.selectedTerm.id, this.form.value).subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your delivery term has been updated.',
            });
            this.dialog.closeAll();
            this.getTerms();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }
}