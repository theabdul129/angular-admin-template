import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { BusinessAccountService } from '../../business-account.service';
import { AccountDetailComponent } from '../account-detail.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
    selector: 'account-basic-info',
    templateUrl: './basic-detail.component.html',
})
export class AccountBasicDetailComponent implements OnInit {
    accountForm: UntypedFormGroup;
    accountId: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    accountData: any;
    formSubmitted: boolean = false;

    constructor(
        private accountComponent: AccountDetailComponent,
        private fb: UntypedFormBuilder,
        private businessService: BusinessAccountService,
        private route: Router,
        public dialog: MatDialog,
    ) {
        this.accountForm = this.fb.group({
            companyNumber: [''],
            legalName: ['', Validators.required],
            website: [''],
            vatId: [''],
            description: [''],
            registeredAddress: [''],
        });
    }

    ngOnInit() {
        if(window.innerWidth<769)this.toggleDrawer();
        this.getAccountDetails();
    }

    getAccountDetails() {
        this.isLoading.next(true);
        this.businessService.getBusinessAccount().subscribe((data) => {
            this.accountData = data;
            this.accountId = data.id;
            this.patchForm(data);
            this.isLoading.next(false);
        });
    }

    patchForm({
        companyNumber,
        legalName,
        website,
        vatId,
        description,
        registeredAddress,
    }) {
        this.accountForm.patchValue({
            companyNumber,
            legalName,
            website,
            vatId,
            description,
            registeredAddress,
        });
    }

    saveForm() {
        this.accountId ? this.updateAccount() : this.createAccount();
    }

    createAccount() {
        this.formSubmitted = true;
        if (this.accountForm.invalid) return;

        this.isLoading.next(true);

        this.businessService
            .addBusinessAccount(this.accountForm.value)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            )
            .subscribe(
                (data) => {
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Your business account details have been saved.',
                    });

                    this.route.navigate([
                        '/admin/business-account/edit',
                        data.body.id,
                    ]);
                },
                (error) => {
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                }
            );
    }

    updateAccount() {
        this.formSubmitted = true;
        if (this.accountForm.invalid) return;

        this.isLoading.next(true);

        this.businessService
            .saveBusinessAccount(this.accountForm.value)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            )
            .subscribe(
                (data) => {
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Your business account details have been saved.',
                    });
                    this.getAccountDetails()
                },
                (error) => {
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                }
            );
    }

    toggleDrawer() {
        this.accountComponent.matDrawer.toggle();
    }

    openModal(modal) {
        this.dialog.open(modal, { width: '650px' });
    }

    closeModal() {
        this.dialog.closeAll();
    }

    archive() {
        this.isLoading.next(true);
        this.businessService.archive(this.accountData.id).subscribe(
            (data) => {
                this.closeModal();
                this.isLoading.next(false);
                if (data.status != 200)
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Archived successfuly.',
                    });
            },
            (error) => {
                this.isLoading.next(false);
                SWALMIXIN.fire({
                    icon: 'error',
                    title: error.error.errorMessage,
                });
                this.closeModal();
            }
        );
    }

    decline() {
        this.isLoading.next(true);
        this.businessService.disable(this.accountData.id).subscribe(
            (data) => {
                this.closeModal();
                this.isLoading.next(false);
                if (data.status != 200) return;
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'Declined successfuly.',
                });
                this.getAccountDetails();
            },
            (error) => {
                SWALMIXIN.fire({
                    icon: 'error',
                    title: error.error.errorMessage,
                });
                this.closeModal();
                this.isLoading.next(false);
            }
        );
    }

    approve() {
        this.isLoading.next(true);
        this.businessService.approve(this.accountData.id).subscribe(
            (data) => {
                this.closeModal();
                this.isLoading.next(false);
                if (data.status != 200) return;
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'Approved successfuly.',
                });
                this.getAccountDetails();
            },
            (error) => {
                SWALMIXIN.fire({
                    icon: 'error',
                    title: error.error.errorMessage,
                });
                this.closeModal();
                this.isLoading.next(false);
            }
        );
    }

    onSubmit(fileName) {
        this.accountForm.value.imageUrl = fileName;
        this.saveForm();
    }
}
