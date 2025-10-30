import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UserService } from '../user.service';
import {
    SearchCountryField,
    CountryISO,
    PhoneNumberFormat,
} from 'ngx-intl-tel-input-gg';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'users-view',
    templateUrl: './user-view.component.html',
})
export class UsersViewComponent implements OnInit {
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();

    form: UntypedFormGroup;
    userData: any;
    editMode: boolean = false;
    separateDialCode = false;
    SearchCountryField = SearchCountryField;
    CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;
    preferredCountries: CountryISO[] = [
        CountryISO.UnitedStates,
        CountryISO.UnitedKingdom,
    ];
    formSubmitted: boolean = false;
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;

    constructor(
        private userService: UserService,
        private formBuilder: UntypedFormBuilder,
        private dialog: MatDialog
    ) {
        this.form = this.formBuilder.group({
            emailAddress: [
                '',
                [
                    Validators.required,
                    Validators.email,

                ],
            ],
            primaryPhone: ['', Validators.required],
            firstName: ['', Validators.required],
            surname: [''],
            homeAddress: [''],
            zoneId: [
                Intl.DateTimeFormat().resolvedOptions().timeZone,
                Validators.compose([Validators.required]),
            ],
        });
    }

    ngOnInit() {
        this.getUser();
    }

    getUser() {
        this.isLoading.next(true);
        this.userService
            .getMe()
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            )
            .subscribe(
                (data: any) => {
                    this.userData = data;
                    this.form.patchValue({
                        firstName: data.firstName,
                        surname: data.surname,
                        primaryPhone: data.primaryPhone,
                        emailAddress: data.emailAddress,
                        homeAddress: data.homeAddress,
                        zoneId: data.zoneId,
                    });
                },
                (error) => {
                    this.isLoading.next(false);
                }
            );
    }

    toggleEditMode(event) {
        this.editMode = event;
    }

    removeAvatar() {
        this._avatarFileInput.nativeElement.value = null;
        this.form.value.profileImagePublicUrl = null;
    }

    updateContact() {
        const result = [];
        /*Object.keys(this.form.controls).forEach((key) => {
            const controlErrors: ValidationErrors = this.form.get(key).errors;
            if (controlErrors) {
                Object.keys(controlErrors).forEach((keyError) => {
                    console.log(
                        'key:',
                        key,
                        ' error:',
                        keyError,
                        ' value:',
                        controlErrors[keyError]
                    );
                });
            }
        });
*/
        if (this.form.invalid) return;
        this.formSubmitted = true;

        this.isLoading.next(true);

        this.form.value.id = this.userData.id;
        this.form.value.primaryPhone =
            this.form.value.primaryPhone.internationalNumber;
        this.userService
            .updateMe(this.form.value)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            )
            .subscribe(
                (data: any) => {
                    this.userData = data;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Your details has been updated.',
                    });
                    this.getUser();
                },
                (error) => {
                    this.isLoading.next(false);
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.errorMessage
                            ? error.errorMessage
                            : error.error.errorMessage,
                    });
                }
            );
    }

    uploadAvatar(modal) {
        this.dialog.open(modal, { width: '360px' });
    }

    closeModal() {
        this.dialog.closeAll();
    }

    getFile(file) {
        this.form.value.profileImagePublicUrl = file;
        this._avatarFileInput.nativeElement.value = file;
    }
}
