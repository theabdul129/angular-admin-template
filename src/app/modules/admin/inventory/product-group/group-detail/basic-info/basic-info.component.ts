import { Location } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { ProductGroup } from 'app/models/productgroup';
import { format } from 'date-fns';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ProductGroupService } from '../../product-group.service';
import { ProductGroupDetailComponent } from '../group-detail.component';

@Component({
    selector: 'product-groupInfo',
    templateUrl: './basic-info.component.html'
})
export class GroupBasicInfoComponent implements OnInit {

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    userForm: UntypedFormGroup;
    selectedProductGroup: any;
    groupId: any;
    formSubmitted: boolean = false;

    constructor(
        private groupComponent: ProductGroupDetailComponent,
        private formBuilder: UntypedFormBuilder,
        private productGroupService: ProductGroupService,
        private router: Router,
        private dialog: MatDialog,
        private ngZone: NgZone,
        private location: Location
    ) {
        this.userForm = this.formBuilder.group({
            name: [null, Validators.compose([Validators.required])],
            description: [null],
            contentLocation: [null],
            orientation: [null],
            displayedDateFrom: [null, Validators.compose([Validators.required])],
            displayedDateTo: [null, Validators.compose([Validators.required])],
            displayedTimeFrom: [null],
            displayedTimeTo: [null]
        });
    }

    ngOnInit() {
        let id = this.router.url.split(['/'][0]);
        this.groupId = Number(id[3]);
        if (this.groupId) this.loadProductGroup();
    }

    onSubmit() {
        this.formSubmitted = true;
        if (this.userForm.invalid) return;
        const id = this.selectedProductGroup ? this.selectedProductGroup.id : 0;
        const registerPayload: ProductGroup = {
            id,
            name: this.userForm.controls.name.value,
            contentLocation: this.userForm.controls.contentLocation.value,
            description: this.userForm.controls.description.value,
            orientation: this.userForm.controls.orientation.value,
            displayedDateFrom:
                new Date(this.userForm.controls.displayedDateFrom.value).getTime() /
                1000,
            displayedDateTo:
                new Date(this.userForm.controls.displayedDateTo.value).getTime() / 1000,
            displayedTimeFrom: this.userForm.controls.displayedTimeFrom.value,
            displayedTimeTo: this.userForm.controls.displayedTimeTo.value
        };
        this.isLoading.next(true);
        this.productGroupService.save(registerPayload, id).subscribe(data => {
            this.ngZone.run(() => {
                this.isLoading.next(false);
                if (data.status != 200) return;
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'Your group details have been saved.',
                });
               id == 0 ? this.router.navigate(['/admin/productgroups/', data.body.id]) : this.loadProductGroup();
            })
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    loadProductGroup() {
        this.isLoading.next(true);
        this.productGroupService.get(this.groupId).subscribe(data => {
            this.ngZone.run(() => {
                this.isLoading.next(false);
                this.selectedProductGroup = data;
                this.userForm.patchValue({
                    name: this.selectedProductGroup.name,
                    description: this.selectedProductGroup.description,
                    contentLocation: this.selectedProductGroup.contentLocation,
                    orientation: this.selectedProductGroup.orientation,
                    displayedDateFrom: format(
                        new Date(this.selectedProductGroup.displayedDateFrom),
                        "yyyy-MM-dd"
                    ),
                    displayedDateTo: format(
                        new Date(this.selectedProductGroup.displayedDateTo),
                        "yyyy-MM-dd"
                    ),
                    displayedTimeFrom: this.selectedProductGroup.displayedTimeFrom,
                    displayedTimeTo: this.selectedProductGroup.displayedTimeTo
                });
            })

        });
    }

    openModal(modal) {
        this.dialog.open(modal, { width: '550px' });
    }

    closeModal() {
        this.dialog.closeAll();
    }

    toggleDrawer() {
        this.groupComponent.matDrawer.toggle();
    }

    liveProductGroup() {
        this.isLoading.next(true);
        this.closeModal();
        this.productGroupService.approveProductGroup(this.groupId).subscribe((data) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your group has been updated.',
            });
            this.loadProductGroup();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    hideProductGroup() {
        this.isLoading.next(true);
        this.closeModal();
        this.productGroupService.disableProductGroup(this.groupId).subscribe((data) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your group has been updated.',
            });
            this.loadProductGroup();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    archive() {
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
                this.closeModal();
                this.productGroupService.archive(this.groupId).subscribe(data => {
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Removed successfuly.',
                    });
                    this.isLoading.next(false);
                    this.location.back();
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