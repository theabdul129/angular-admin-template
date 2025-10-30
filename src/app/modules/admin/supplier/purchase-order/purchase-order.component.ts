import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { StoreService } from 'app/modules/admin/stores/store.service';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { SuppliersService } from '../supplier.service';

@Component({
    selector: 'suppliers-purchaseOrder',
    templateUrl: './purchase-order.component.html'
})
export class SupplierPurchaseOrdersComponent implements OnInit {

    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['id', 'name', 'created', 'term', 'action'];
    dataSource: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    errorMsg: any;
    totalAccounts: any;
    supplierId: any;
    form: UntypedFormGroup;
    selectedData: any;
    products: any;
    terms: any;
    stores: any;
    deliveryTerms: any;
    formSubmitted: boolean = false;
    suppliers: any;

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private supplierService: SuppliersService,
        private route: Router,
        private dialog: MatDialog,
        private formBuilder: UntypedFormBuilder,
        private storeService: StoreService,
    ) {
        this.form = this.formBuilder.group({
            invoiceNumber: '',
            purchaseOrderNumber: ['', Validators.required],
            notes: [''],
            supplierNotes: [''],
            term: ['', Validators.required],
            deliveryTerm: ['', Validators.required],
            store: ['', Validators.required],
            supplier: []
        });
    }

    ngOnInit() {
        this.getPurchaseOrders();
        this.getSuppliers();
        this.getStores();
    }

    getStores() {
        this.storeService.getStores(0, 500).subscribe(data => this.stores = data.data);
    }

    getSuppliers() {
        this.supplierService.getAll(0, 500).subscribe(data => this.suppliers = data.data);
    }

    supplierChange(event) {
        this.supplierId = event.value;
        this.getTerms(this.supplierId);
    }

    getTerms(id) {
        this.supplierService.getTerms(id, 0, 500).subscribe(data => this.terms = data.data);
    }

    termChange(event) {
        this.getDeliveryTerms(event.value);
    }

    getDeliveryTerms(termId) {
        this.supplierService.getDeliveryTerms(this.supplierId, termId, 0, 500).subscribe(data => this.deliveryTerms = data.data);
    }

    getPurchaseOrders() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.supplierService.purchaseOrders(this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize)
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
        this.getPurchaseOrders();
    }

    openModal(modal, data) {
        this.selectedData = data;
        if (this.selectedData) {
            this.getTerms(this.selectedData.supplier);
            this.getDeliveryTerms(this.selectedData.term.id);
            this.form.patchValue({
                invoiceNumber: this.selectedData.invoiceNumber,
                purchaseOrderNumber: this.selectedData.purchaseOrderNumber,
                notes: this.selectedData.notes,
                supplierNotes: this.selectedData.supplierNotes,
                term: this.selectedData.term.id,
                deliveryTerm: this.selectedData.deliveryTerm.id,
                store: this.selectedData.store.id,
                supplier: this.selectedData.supplier
            })
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
        this.form.value.deliveryTerm = { id: this.form.value.deliveryTerm };
        this.form.value.store = { id: this.form.value.store };
        this.form.value.term = { id: this.form.value.term };
        this.supplierService.addPurchaseOrder(this.form.value).subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your purchase order details have been saved.',
            });
            this.dialog.closeAll();
            this.getPurchaseOrders();
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
        this.form.value.deliveryTerm = { id: this.form.value.deliveryTerm };
        this.form.value.store = { id: this.form.value.store };
        this.form.value.term = { id: this.form.value.term };
        this.supplierService.updatePurchaseOrder(this.selectedData.id, this.form.value).subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your product has been updated.',
            });
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    removeItem(id) {
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
                this.supplierService.deletePurchaseOrder(id).subscribe(data => {
                    if (data.status != 200) return;
                    this.isLoading.next(false);
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Archived successfuly.',
                    });
                    this.getPurchaseOrders();
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
}