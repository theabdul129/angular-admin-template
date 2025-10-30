import { Location } from '@angular/common';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { CatchmentProductPrice } from 'app/models/catchmentproductprice';
import { BehaviorSubject, Observable } from 'rxjs';
import { InventoryService } from '../../../inventory.service';
import { ProductDetailComponent } from '../product-detail.component';
import { TaxService } from 'app/modules/admin/accounting/tax/tax.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'product-catchmentprice',
    templateUrl: './catchmentprice.component.html'
})
export class CatchmentPriceComponent implements OnInit {

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    selectedProduct;
    productId: any;
    gtinForm: UntypedFormGroup;
    dataSource: any;
    errorMsg: any;
    priceTable: UntypedFormGroup;
    selectProductId;
    productCatchmentPrices: Array<CatchmentProductPrice>;
    touchedRows: any;
    selectedCatchmentArea;
    control: UntypedFormArray;
    taxes: any;
    pageSize: number = 10;
    pageNumber: number = 0;
    totalAccounts: any;
    displayedColumns: string[] = ['id', 'price', 'tax', 'from', 'to', 'action'];
    formSubmitted: boolean = false;
    productData: any;
    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        public dialog: MatDialog,
        private productComponent: ProductDetailComponent,
        private inventory: InventoryService,
        private route: Router,
        private formBuilder: UntypedFormBuilder,
        private location: Location,
        private taxService: TaxService
    ) {
        this.priceTable = this.formBuilder.group({
            product: [''],
            catchmentArea: [''],
            unitPrice: ['', Validators.required],
            validFrom: '',
            validTo: '',
            tax: ['', Validators.required]
        });
    }

    ngOnInit() {
        let storeId = this.route.url.split(['/'][0]);
        this.selectProductId = Number(storeId[4]);
        this.getProduct();
        if (this.selectProductId) this.loadData();
        else this.location.back();
        this.getTaxes();
    }

    getProduct() {
        this.inventory.get(this.selectProductId).subscribe(data => this.productData = data);
    }

    getTaxes() {
        this.taxService.getAll(0, 500).subscribe(data => this.taxes = data.data);
    }

    loadData() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.inventory.getAllCatchmentarea(this.selectProductId, this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize).pipe(
            finalize(() => {
                this.isLoading.next(false);
            })
        ).subscribe((data: any) => {
            this.dataSource.data = data.data;
            this.dataSource.paginator = this.paginator;
            this.totalAccounts = data.totalSize;
            this.productCatchmentPrices = data.data;
            this.isLoading.next(false);
        });
    }

    paginate(event: PageEvent) {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadData();
    }

    toggleDrawer() {
        this.productComponent.matDrawer.toggle();
    }

    submitForm() {
        this.formSubmitted = true;
        if (this.priceTable.invalid) return;
        let payload = {
            id: this.selectedCatchmentArea ? this.selectedCatchmentArea.id : 0,
            product: { id: this.selectProductId },
            catchmentArea: { id: this.priceTable.value.catchmentArea.id },
            unitPrice: this.priceTable.value.unitPrice * 100,
            validFrom: this.priceTable.value.validFrom,
            validTo: this.priceTable.value.validTo,
            tax: { id: this.priceTable.value.tax }
        }
        this.isLoading.next(true);
        this.inventory
            .saveCatchmentarea([payload], this.selectProductId)
            .subscribe(data => {
                this.isLoading.next(false);
                if (data.status != 200) return;
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'Your catchment area details have been saved.',
                });
                this.dialog.closeAll();
                this.loadData();
                this.formSubmitted = false;
            }, error => {
                this.isLoading.next(false);
                SWALMIXIN.fire({
                    icon: 'error',
                    title: error.error.errorMessage,
                });
            });
    }

    closeModal() {
        this.dialog.closeAll();
    }

    openModal(modal, data) {
        this.dialog.open(modal, { width: '600px' });
        this.selectedCatchmentArea = data;
        if (data) {
            this.priceTable.patchValue({
                catchmentArea: data.catchmentArea,
                unitPrice: data.unitPrice / 100,
                validFrom: data.validFrom,
                validTo: data.validTo,
                tax: data.tax.id
            })
        } else this.priceTable.reset();
    }
}