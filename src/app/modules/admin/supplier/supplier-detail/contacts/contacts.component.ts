import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { SuppliersService } from '../../supplier.service';
import { SupplierDetailComponent } from '../supplier-detail.component';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
    selector: 'suppliers-contacts',
    templateUrl: './contacts.component.html'
})
export class SupplierContactsComponent implements OnInit {

    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['id', 'name', 'created', 'term', 'action'];
    dataSource: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    supplierId: any;
    errorMsg: any;
    totalAccounts: any;
    selectedData: any;
    form: UntypedFormGroup;
    formSubmitted: boolean = false;

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private supplierService: SuppliersService,
        private route: Router,
        private supplierComponent: SupplierDetailComponent,
        private dialog: MatDialog,
        private formBuilder: UntypedFormBuilder,
        private location: Location
    ) {
        this.form = this.formBuilder.group({
            address: [''],
            emailAddress: ['', [Validators.required, Validators.email,

                
                ]],
            firstName: ['', Validators.required],
            surname: [],
            position: []
        })
    }

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.supplierId = Number(id[3]);
        if (this.supplierId) this.loadData();
        else this.location.back();
    }

    loadData() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.supplierService.get(this.supplierId)
            .subscribe((data: any) => {
                this.dataSource.data = data.contacts;
                this.dataSource.paginator = this.paginator;
                this.totalAccounts = data.contacts.length;
                this.isLoading.next(false);
            }, error => {
                this.isLoading.next(false);
                this.errorMsg = error.message;
            })
    }

    openModal(modal, data) {
        this.selectedData = data;
        this.dialog.open(modal, { width: '650px' });
        if (this.selectedData) {
            this.form.patchValue({
                address: this.selectedData.address,
                emailAddress: this.selectedData.emailAddress,
                firstName: this.selectedData.firstName,
                surname: this.selectedData.surname,
                position: this.selectedData.position
            })
        } else this.form.reset();
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
        this.supplierService.addContact(this.supplierId, this.form.value).subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your contact have been saved.',
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
        this.supplierService.updateContact(this.supplierId, this.selectedData.id, this.form.value).subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your contact has been updated.',
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

    deleteContact(id) {
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
                    .deleteContact(this.supplierId, id)
                    .subscribe(data => {
                        if (data.status != 200) return;
                        this.isLoading.next(false);
                        SWALMIXIN.fire({
                            icon: 'success',
                            title: 'Removed successfuly.',
                        });
                        this.loadData();
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