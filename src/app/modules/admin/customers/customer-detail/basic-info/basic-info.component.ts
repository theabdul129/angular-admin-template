import { Component, Input, NgZone, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { Location } from '@angular/common';
import { CustomerDetailComponent } from '../customer-detail.component';
import { User } from 'app/models/user';
import { CustomerService } from '../../customer.service';
import { BehaviorSubject, Observable } from 'rxjs';
import {
    SearchCountryField,
    CountryISO,
    PhoneNumberFormat,
} from 'ngx-intl-tel-input-gg';
import { RegisterUser } from 'app/models/registerUser';

@Component({
    selector: 'basic-customerDetail',
    templateUrl: './basic-info.component.html',
})
export class CustomerBasicDetailComponent implements OnInit {
    userForm: UntypedFormGroup;
    contactUserForm: UntypedFormGroup;
    customerId: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    @Input() selectedCustomer: any;
    formSubmitted: boolean = false;
    separateDialCode = false;
    SearchCountryField = SearchCountryField;
    CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;
    preferredCountries: CountryISO[] = [
        CountryISO.UnitedStates,
        CountryISO.UnitedKingdom,
    ];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: Router,
        public dialog: MatDialog,
        private customerComponent: CustomerDetailComponent,
        private ngZone: NgZone,
        private customerService: CustomerService,
        private location: Location
    ) {
        this.userForm = this.formBuilder.group({
            emailAddress: ['', [Validators.required, Validators.email]],
            primaryPhone: [''],
            firstName: ['', Validators.required],
            surname: [''],
        });

        this.contactUserForm = this.formBuilder.group({
            body: [undefined, Validators.required],
            subject: [undefined, Validators.required],
            contactMethod: [undefined, Validators.required],
        });
    }

    ngOnInit() {
        const id = this.route.url.split(['/'][0]);
        this.customerId = id[3];
        if (this.customerId) {this.loadCustomer();}
    }

    loadCustomer() {
        if(this.customerId=="add"){
            return;
        }
        this.isLoading.next(true);
        this.customerService.get(this.customerId).subscribe((data) => {
            this.isLoading.next(false);
            this.selectedCustomer = data;
            this.userForm.patchValue({
                firstName: this.selectedCustomer.firstName,
                surname: this.selectedCustomer.surname,
                primaryPhone: this.selectedCustomer.primaryPhone,
                emailAddress: this.selectedCustomer.emailAddress,

            });
        });
    }

    onSubmit() {
        this.formSubmitted = true;

        if (this.userForm.invalid) {return;}
        const registerPayload: User = {
            primaryPhone:
                this.userForm.controls.primaryPhone.value?.internationalNumber,
            firstName: this.userForm.controls.firstName.value,
            surname: this.userForm.controls.surname.value,
            emailAddress: this.userForm.controls.emailAddress.value,

            zoneId: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };

        const registerUser: RegisterUser = {
            createdAt: null,
            deviceToken: null,
            invitationCode: null,
            captchaToken: null,
            authId: null,
            userDetail: registerPayload,
        };

        if (this.selectedCustomer != undefined) {
            this.isLoading.next(true);
            this.customerService
                .update(registerPayload, this.selectedCustomer.accountNumber)
                .subscribe(
                    (data) => {
                        this.isLoading.next(false);
                        this.ngZone.run(() => {
                            if (data.status != 200) {return;}
                            SWALMIXIN.fire({
                                icon: 'success',
                                title: 'Your customer has been updated.',
                            });
                            this.loadCustomer();
                        });
                    },
                    (error) => {
                        this.isLoading.next(false);
                        SWALMIXIN.fire({
                            icon: 'error',
                            title: error.error.errorMessage,
                        });
                    }
                );
        } else {
            this.customerService.register(registerUser).subscribe(
                (data) => {
                    this.ngZone.run(() => {
                        if (data.status != 200) {return;}
                        SWALMIXIN.fire({
                            icon: 'success',
                            title: 'Your customer details have been saved.',
                        });
                        this.route.navigate([
                            '/admin/customers/',
                            data.body.id,
                        ]);
                    });
                    this.route.navigateByUrl('/admin/customers');
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

    toggleDrawer() {
        this.customerComponent.matDrawer.toggle();
    }
}
