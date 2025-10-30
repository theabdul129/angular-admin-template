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
import { finalize } from 'rxjs/operators';
import { InventoryService } from 'app/modules/admin/inventory/inventory.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { SuppliersService } from '../../supplier.service';
import { SupplierDetailComponent } from '../supplier-detail.component';

@Component({
    selector: 'suppliers-products',
    templateUrl: './products.component.html',
})
export class SupplierProductsComponent implements OnInit {
    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['id', 'image', 'name', 'created', 'sku', 'action'];
    dataSource: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    errorMsg: any;
    totalAccounts: any;
    supplierId: any;
    form: UntypedFormGroup;
    selectedData: any;
    products: any;
    formSubmitted: boolean = false;

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private supplierService: SuppliersService,
        private route: Router,
        private location: Location,
        private supplierComponent: SupplierDetailComponent,
        private dialog: MatDialog,
        private formBuilder: UntypedFormBuilder,
        private inventory: InventoryService
    ) {
        this.form = this.formBuilder.group({
            product: ['', Validators.required],
            sku: ['', Validators.required],
            notes: [''],
        });
    }

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.supplierId = Number(id[3]);
        if (this.supplierId) this.getProducts();
        // else this.location.back();
        this.registeredProducts();
    }

    registeredProducts() {
        this.inventory
            .getAll(0, 50)
            .subscribe((data) => (this.products = data.data));
    }

    getProducts() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.supplierService
            .getProducts(
                this.supplierId,
                this.paginator ? this.paginator.pageIndex : this.pageNumber,
                this.paginator ? this.paginator.pageSize : this.pageSize
            )
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            )
            .subscribe(
                (data: any) => {
                    this.dataSource.data = data.data;
                    this.dataSource.paginator = this.paginator;
                    this.totalAccounts = data.totalSize;
                },
                (error) => {
                    this.errorMsg = error.message;
                }
            );
    }

    paginate(event: PageEvent) {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getProducts();
    }

    toggleDrawer() {
        this.supplierComponent.matDrawer.toggle();
    }

    openModal(modal, data) {
        this.selectedData = data;
        if (this.selectedData) {
            this.form.patchValue({
                product: this.selectedData.product,
            });
        } else this.form.reset();
        this.dialog.open(modal, { width: '650px' });
    }

    closeModal() {
        this.selectedData = null;
        this.dialog.closeAll();
    }

    onSubmit() {
        this.selectedData ? this.updateData() : this.saveData();
    }

    saveData() {
        this.formSubmitted = true;
        if(this.form.invalid) return;
        this.isLoading.next(true);
        this.form.value.id = 0;
        this.form.value.product = this.form.value.product;
        this.supplierService
            .addProduct(this.supplierId, [this.form.value])
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            )
            .subscribe(
                (data: any) => {
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Your product details have been saved.',
                    });
                    this.dialog.closeAll();
                    this.getProducts();
                },
                (error) => {
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                }
            );
    }

    updateData() {
        this.formSubmitted = true;
        if(this.form.invalid) return;
        this.isLoading.next(true);
        this.supplierService
            .updateTerm(this.supplierId, this.selectedData.id, this.form.value)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            )
            .subscribe(
                (data: any) => {
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Your product has been updated.',
                    });
                },
                (error) => {
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                }
            );
    }
}
