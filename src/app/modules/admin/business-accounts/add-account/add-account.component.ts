import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { BusinessAccountService } from '../business-account.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'addAccount',
    templateUrl: './add-account.component.html'
})
export class AddAccountComponent implements OnInit {

    accountForm: UntypedFormGroup;
    accountId: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    accountData: any;
    dataSource: any;
    errorMsg: any;
    totalAccounts: any;

    constructor(
        private fb: UntypedFormBuilder,
        private businessService: BusinessAccountService,
        public dialog: MatDialog
    ) {
        this.accountForm = this.fb.group({
            companyNumber: ['', Validators.required],
            legalName: ['', Validators.required],
            website: [''],
            vatId: [''],
            description: [''],
            registeredAddress: ['', Validators.required],
        });
    }

    ngOnInit() { }

        saveForm() {
        this.createAccount();
    }

    createAccount() {
        this.businessService.addBusinessAccount(this.accountForm.value).subscribe(data => {
            if(data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your business account details have been saved.',
            });
        }, error => {
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        })
    }

}