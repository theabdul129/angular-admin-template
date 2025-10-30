import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';

import { TaxService } from 'app/modules/admin/accounting/tax/tax.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { SuppliersService } from '../../supplier.service';
import { SupplierDetailComponent } from '../supplier-detail.component';

@Component({
    selector: 'suppliers-productPrices',
    templateUrl: './prices.component.html'
})
export class SupplierProductPricesComponent implements OnInit {

    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['id', 'name', 'created', 'term', 'from', 'to', 'action'];
    dataSource: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    supplierId: any;
    selectProductId: any;
    errorMsg: any;
    totalAccounts: any;
    selectedData: any;
    form: UntypedFormGroup;
    taxes: any;
    currencyList = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'SGD', 'CHF', 'MYR', 'JPY', 'CNY'];
    formSubmitted: boolean = false;

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private supplierService: SuppliersService,
        private route: Router,
        private location: Location,
        private supplierComponent: SupplierDetailComponent,
        private dialog: MatDialog,
        private formBuilder: UntypedFormBuilder,
        private taxService: TaxService
    ) {
        this.form = this.formBuilder.group({
            unitPrice: ['', Validators.required],
            validFrom: [''],
            validTo: [''],
            tax: ['', Validators.required],
            currency: ['', Validators.required]
        })
    }

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.supplierId = Number(id[3]);
        this.selectProductId = Number(id[5]);
        if (this.supplierId) this.loadData();
        else this.location.back();
        this.getTaxes();
    }

    loadData() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.supplierService.getPrices(this.selectProductId, this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize)
            .subscribe((data: any) => {
                this.dataSource.data = data.data;
                this.dataSource.paginator = this.paginator;
                this.totalAccounts = data.totalSize;
                this.isLoading.next(false);
            }, error => {
                this.isLoading.next(false);
                this.errorMsg = error.message;
            })
    }

    getTaxes() {
        this.taxService.getAll(0, 500).subscribe(data => this.taxes = data.data);
    }

    paginate(event: PageEvent) {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadData();
    }

    openModal(modal, data) {
        this.selectedData = data;
        this.dialog.open(modal, { width: '650px' });
        if (this.selectedData) {
            this.form.patchValue({
                unitPrice: this.selectedData.unitPrice / 100,
                validFrom: this.selectedData.validFrom,
                validTo: this.selectedData.validTo,
                tax: this.selectedData.tax.id,
                currency: this.selectedData.currency
            })
        }
    }

    closeModal() {
        this.selectedData = null;
        this.dialog.closeAll();
    }

    toggleDrawer() {
        this.supplierComponent.matDrawer.toggle();
    }

    onSubmit() {
        this.selectedData ? this.updateData() : this.saveData();
    }

    saveData() {
        this.formSubmitted = true;
        if(this.form.invalid) return;
        this.form.value.unitPrice = this.form.value.unitPrice * 100;
        this.form.value.id = 0;
        this.form.value.product = { id: this.selectProductId },
            this.form.value.tax = { id: this.form.value.tax }
        this.supplierService.addPrice(this.selectProductId, [this.form.value]).subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your price details have been saved.',
            });
            this.dialog.closeAll();
            this.loadData();
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
        this.form.value.unitPrice = this.form.value.unitPrice * 100;
        this.form.value.product = { id: this.selectProductId },
            this.form.value.tax = { id: this.form.value.tax }
        this.supplierService.updatePrice(this.selectProductId, this.selectedData.id, [this.form.value]).subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your price has been updated.',
            });
            this.dialog.closeAll();
            this.loadData();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }
}