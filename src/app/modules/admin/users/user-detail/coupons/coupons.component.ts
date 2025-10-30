import { Location } from '@angular/common';
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
import { UserService } from '../../user.service';
import { UsersDetailComponent } from '../user-detail.component';

@Component({
    selector: 'users-coupons',
    templateUrl: './coupons.component.html'
})
export class UserCouponsComponent implements OnInit {

    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['id', 'name', 'validFrom', 'action'];
    dataSource: any;
    errorMsg: any;
    totalAccounts: any;
    selectedUserId: any;
    form: UntypedFormGroup;
    formSubmitted: boolean = false;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private userService: UserService,
        private userComponent: UsersDetailComponent,
        private route: Router,
        private fb: UntypedFormBuilder,
        private dialog: MatDialog,
        private location: Location
    ) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            credit: ['', Validators.required],
            validFrom: ['', Validators.required]
        })
    }

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.selectedUserId = Number(id[3]);
        if (this.selectedUserId) this.getData();
        else this.location.back();
    }

    getData() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.userService.getCoupons(this.selectedUserId, this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            ).subscribe((data: any) => {
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
        this.getData();
    }

    openModal(modal, data) {
        this.dialog.open(modal, { width: '500px' })
    }

    toggleDrawer() {
        this.userComponent.matDrawer.toggle();
    }

    closeModal() {
        this.dialog.closeAll();
    }

    onSubmit() {
        this.formSubmitted = true;
        this.isLoading.next(true);
        this.form.value.id = 0;
        this.dialog.closeAll();
        this.userService.addCoupon(this.selectedUserId, this.form.value).pipe(
            finalize(() => {
                this.isLoading.next(false);
                this.formSubmitted = false;
            })
        )
            .subscribe((data: any) => {
                if (data.status != 200) return;
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'Your coupon details have been saved.',
                });
                this.getData();
            }, error => {
                this.isLoading.next(false);
                this.formSubmitted = false;
                SWALMIXIN.fire({
                    icon: 'error',
                    title: error.error.errorMessage,
                });
            })
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
                this.userService.deleteCoupon(id).subscribe((data: any) => {
                    this.isLoading.next(false);
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Removed successfuly.',
                    });
                    this.getData();
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