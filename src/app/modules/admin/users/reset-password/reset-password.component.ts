import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UserService } from '../user.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input-gg';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();

    form: UntypedFormGroup;
    userData: any;
    editMode: boolean = false;
    separateDialCode = false;
    SearchCountryField = SearchCountryField;
    CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;
    preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
    formSubmitted: boolean = false;
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;

    constructor(
        private userService: UserService,
        private formBuilder: UntypedFormBuilder,
        private dialog: MatDialog,
        private location: Location
    ) {
        this.form = this.formBuilder.group({
            emailAddress: ['', [Validators.required, Validators.email,

        ]
            ,
            ],
            primaryPhone: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword: ['']
        });
    }

    ngOnInit() { }

    back() {
        this.location.back();
    }

    update() {
        this.isLoading.next(true);
        this.formSubmitted = true;
        if (this.form.invalid) return;
        this.form.value.matcher = 'email';
        this.form.value.primaryPhone = this.form.value.primaryPhone.internationalNumber;
        this.userService.resetPassword(this.form.value).pipe(
            finalize(() => {
                this.isLoading.next(false);
            })
        ).subscribe((data: any) => {
            this.userData = data;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your details has been updated.',
            });
            this.back();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.errorMessage
                    ? error.errorMessage
                    : error.error.errorMessage,
            });
        })
    }

}