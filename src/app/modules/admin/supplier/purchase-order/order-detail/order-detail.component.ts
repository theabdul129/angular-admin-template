import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SuppliersService } from '../../supplier.service';

@Component({
    selector: 'purchase-order-detail',
    templateUrl: './order-detail.component.html'
})
export class PurchaseOrderDetailComponent implements OnInit {

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    errorMsg: any;
    supplierId: any;
    orderId: any;
    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['email', 'id', 'account', 'name', 'number', 'action'];
    dataSource: any;
    totalAccounts: any;
    form: UntypedFormGroup;
    selectedData: any;
    products: any;
    productPrice: any;
    orderGenerated: boolean = false;
    orderData: any;
    orderDetail: any;
    suppliers: any;
    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private supplierService: SuppliersService,
        private route: Router,
        private dialog: MatDialog,
        private formBuilder: UntypedFormBuilder
    ) {
        this.form = this.formBuilder.group({
            product: ['', Validators.required],
            productPrice: ['', Validators.required],
            quantity: ['', Validators.required],
            bestBefore: [''],
            supplier: []
        })
    }

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.orderId = Number(id[4]);
        this.getOrder();
        this.getProducts();
        this.getSuppliers();
    }

    getSuppliers() {
        this.supplierService.getAll(0, 500).subscribe(data => this.suppliers = data.data);
    }

    supplierChange(event) {
        this.supplierProducts(event.value)
    }

    supplierProducts(supplierId) {
        this.supplierService.getProducts(supplierId, 0, 500).subscribe((data: any) => this.products = data.data)
    }

    deliverOrder() {
        this.isLoading.next(true);
        this.supplierService.deliverOrder(this.orderId).subscribe(data => {
            if (data.status != 200) return;
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Delivered successfuly.',
            });
            this.getOrder();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    completeOrder() {
        this.isLoading.next(true);
        this.supplierService.completeOrder(this.orderId).subscribe(data => {
            if (data.status != 200) return;
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Completed successfuly.',
            });
            this.getOrder();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    getOrder() {
        this.isLoading.next(true);
        this.supplierService.getPurchaseOrder(this.orderId).pipe(
            finalize(() => {
                this.isLoading.next(false);
            })
        ).subscribe(data => {
            this.orderDetail = data
        });
    }

    getProducts() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.supplierService.getPurchaseProducts(this.orderId, this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize)
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

    paginate(event: PageEvent) {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getProducts();
    }

    openModal(modal, data) {
        this.dialog.open(modal, { width: '650px' });
        this.selectedData = data;
        if (this.selectedData) {
            this.supplierProducts(this.selectedData.supplier)
            this.getPrices(this.selectedData.productPrice.product.id);
            this.form.patchValue({
                product: this.selectedData.productPrice.product.id,
                productPrice: this.selectedData.productPrice,
                quantity: this.selectedData.quantity,
                bestBefore: this.selectedData.bestBefore,
                supplier: this.selectedData.supplier
            })
        } else this.form.reset();
    }

    closeModal() {
        this.dialog.closeAll();
        this.selectedData = null;
        this.form.reset();
    }

    onSubmit() {
        this.selectedData ? this.updateData() : this.saveData();
    }

    saveData() {
        this.isLoading.next(true);
        this.form.value.id = 0;
        delete this.form.value.product;
        this.supplierService.addPurchaseProduct(this.orderId, this.form.value).subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your product details have been saved.',
            });
            this.dialog.closeAll();
            this.getProducts();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    updateData() {
        this.isLoading.next(true);
        delete this.form.value.product;
        this.supplierService.updatePurchaseProduct(this.orderId, this.selectedData.id, this.form.value).subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your product has been updated.',
            });
            this.dialog.closeAll();
            this.getProducts();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    onChange(event) {
        this.getPrices(event.value);
    }

    getPrices(id) {
        this.supplierService.getPrices(id, 0, 500).subscribe((data: any) => this.productPrice = data.data)
    }

    deleteItem(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.isLoading.next(true);
                this.supplierService
                    .removePurchaseProduct(this.orderId, id)
                    .subscribe(data => {
                        if (data.status != 200) return;
                        this.isLoading.next(false);
                        SWALMIXIN.fire({
                            icon: 'success',
                            title: 'Removed successfuly.',
                        });
                        this.getProducts();
                    }, error => {
                        this.isLoading.next(false);
                        SWALMIXIN.fire({
                            icon: 'error',
                            title: error.error.errorMessage,
                        });
                    });
            }
        });
    }

    generateOrder() {
        this.orderGenerated = true;
        this.isLoading.next(true);
        this.supplierService.generateOrder(this.orderId).subscribe((data: any) => {
            this.isLoading.next(false);
            this.orderData = data;
        })
    }

    print() {
        window.print();
    }
}