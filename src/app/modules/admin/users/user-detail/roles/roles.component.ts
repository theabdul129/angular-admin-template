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
    selector: 'users-roles',
    templateUrl: './roles.component.html'
})
export class UserRolesComponent implements OnInit {

    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['id', 'name', 'action'];
    dataSource: any;
    errorMsg: any;
    totalAccounts: any;
    selectedUserId: any;
    form: UntypedFormGroup;
    roles: any;
    selectedRoles: any;

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
        this.initForm();
    }

    initForm(){
        this.form = this.fb.group({
            name: ['', Validators.required]
        })
    }

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.selectedUserId = Number(id[3]);
        if (this.selectedUserId) this.getRoles();
        else this.location.back();
        this.definedRoles();
    }

    definedRoles() {
        this.userService.getAllRolesToAdd().subscribe(data => {
            this.roles = data
        });
    }

    getRoles() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.userService.getCollaboratorRoles(this.selectedUserId)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            ).subscribe((data: any) => {
                this.selectedRoles = data;
                this.dataSource.data = data;
                this.dataSource.paginator = this.paginator;
                this.totalAccounts = data.length;
            }, error => {
                this.isLoading.next(false);
                this.errorMsg = error.message;
            })
    }

    paginate(event: PageEvent) {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getRoles();
    }

    openModal(modal, data) {
        this.initForm();
        this.dialog.open(modal, { width: '550px' })
    }

    toggleDrawer() {
        this.userComponent.matDrawer.toggle();
    }

    closeModal() {
        this.dialog.closeAll();
    }

    onSubmit() {
        this.selectedRoles.push(this.form.value.name)
        this.userService.addCollaboratorRoles(this.selectedUserId, this.selectedRoles).subscribe((data: any) => {
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your role details have been saved.',
            });
            this.dialog.closeAll();
            this.getRoles();
        }, error => {
            SWALMIXIN.fire({
                icon: 'error',
                title: error?.error?.message||error.message,
            });
        })
    }

    deleteRole(id) {
        let data = this.selectedRoles.filter(data => data.id != id);
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
                this.userService.addRole(this.selectedUserId, data).subscribe((data: any) => {
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Removed successfuly.',
                    });
                    this.getRoles();
                }, error => {
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                });
            }
        });
    }

    removeUnderScore(inputItem) {
        return inputItem.replace(/_/g, ' ');
    }
}