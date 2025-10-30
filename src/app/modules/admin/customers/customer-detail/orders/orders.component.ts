import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { CustomerService } from '../../customer.service';
import { CustomerDetailComponent } from '../customer-detail.component';

@Component({
    selector: 'customers-orders',
    templateUrl: './orders.component.html'
})
export class CustomerOrdersComponent implements OnInit {

    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['id', 'name', 'created', 'term', 'action'];
    dataSource: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    errorMsg: any;
    totalAccounts: any;
    customerId: any;
    form: UntypedFormGroup;
    selectedData: any;
    products: any;

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private route: Router,
        private location: Location,
        private dialog: MatDialog,
        private formBuilder: UntypedFormBuilder,
        private customerService: CustomerService,
        private customerComponent: CustomerDetailComponent,
    ) {
        this.form = this.formBuilder.group({
            address: ['']
        });
    }

    ngOnInit() {
        if(window.innerWidth<769)this.toggleDrawer();
        let id = this.route.url.split(['/'][0]);
        this.customerId = id[3];
        if (this.customerId) this.loadData();
    }

    loadData() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.customerService.getOrders(this.customerId, this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize).subscribe((data: any) => {
            this.dataSource.data = data.data;
            this.dataSource.paginator = this.paginator;
            this.totalAccounts = data.totalSize;
            this.isLoading.next(false);
        }, error => {
            this.isLoading.next(false);
            this.errorMsg = error.message;
        });
    }

    paginate(event: PageEvent) {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadData();
    }

    toggleDrawer() {
        this.customerComponent.matDrawer.toggle();
    }

    openModal(modal, data) {
        this.selectedData = data;
        if (this.selectedData) {
            this.form.patchValue({
                address: this.selectedData.address,
            })
        } else this.form.reset();
        this.dialog.open(modal, { width: '650px' });
    }

    closeModal() {
        this.selectedData = null;
        this.dialog.closeAll();
    }

    onSubmit() {
    }

    delete(id) {
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
                this.customerService.deleteDeliveryAddress(this.customerId, id).subscribe(data => {
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Removed successfuly.',
                    });
                }, error => {
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                });
            }
        });
    }
}