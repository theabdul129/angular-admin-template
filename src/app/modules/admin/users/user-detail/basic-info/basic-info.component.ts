import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { Courier } from 'app/models/courier';
import { StoreLocation } from 'app/models/location';
import { UsersDetailComponent } from '../user-detail.component';
import { User } from 'app/models/user';
import { UserService } from '../../user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input-gg';
import { AuthService } from '@auth0/auth0-angular';

@Component({
    selector: 'basic-userDetail',
    templateUrl: './basic-info.component.html',
})
export class UserBasicDetailComponent implements OnInit {
    userForm: UntypedFormGroup;
    contactUserForm: UntypedFormGroup;
    customerId: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    @Input() selectedCourier: Courier;
    courierCurrentLocation: StoreLocation;
    routes: any[] = [];
    selectedUserId: any;
    selectedUser: User;
    formSubmitted: boolean = false;
    separateDialCode = false;
    SearchCountryField = SearchCountryField;
    CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;
    preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: Router,
        public dialog: MatDialog,
        private userComponent: UsersDetailComponent,
        private userService: UserService,
        public auth: AuthService
    ) {
        this.userForm = this.formBuilder.group({
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
        let id = this.route.url.split(['/'][0]);
        this.selectedUserId = Number(id[3]);
        if (this.selectedUserId) this.loadUser();
        else this.loadAdmin();
    }

    loadAdmin() {
        this.isLoading.next(true);
        this.auth.user$.subscribe((data: any) => {
            this.isLoading.next(false);
            this.userForm.patchValue({
                firstName: data.name,
                surname: data.surname,
                primaryPhone: data.primaryPhone,
                emailAddress: data.email,
                homeAddress: data.homeAddress,
                zoneId: data.zoneId,
            });
        })
    }

    loadUser() {
        this.isLoading.next(true);
        this.userService.get(this.selectedUserId).subscribe((data) => {
            this.isLoading.next(false);
            this.selectedUser = data;
            this.userForm.patchValue({
                firstName: this.selectedUser.firstName,
                surname: this.selectedUser.surname,
                primaryPhone: this.selectedUser.primaryPhone,
                emailAddress: this.selectedUser.emailAddress,
                homeAddress: this.selectedUser.homeAddress,
                zoneId: this.selectedUser.zoneId,
            });
        });
    }

    onSubmit() {
        this.formSubmitted = true;
        if (this.userForm.invalid) return;
        if (this.selectedUser != undefined) {
            const registerPayload = {
                id: this.selectedUser ? this.selectedUser.id : 0,
                primaryPhone: this.userForm.value.primaryPhone.internationalNumber,
                firstName: this.userForm.value.firstName,
                surname: this.userForm.value.surname,
                emailAddress: this.userForm.value.emailAddress,
                homeAddress: this.userForm.value.homeAddress,
                zoneId:
                    this.userForm.value.zoneId ||
                    Intl.DateTimeFormat().resolvedOptions().timeZone,
            };
            this.isLoading.next(true);
            this.userService
                .update(registerPayload, this.selectedUser.id)
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
                            title: 'Your user has been updated.',
                        });

                        this.loadUser();
                    },
                    (error) => {
                        SWALMIXIN.fire({
                            icon: 'error',
                            title: error.errorMessage
                                ? error.errorMessage
                                : error.error.errorMessage,
                        });
                    }
                );
        } else {
            const registerPayload = {
                userDetail: {
                    id: 0,
                    primaryPhone: this.userForm.value.primaryPhone.internationalNumber,
                    firstName: this.userForm.value.firstName,
                    surname: this.userForm.value.surname,
                    emailAddress: this.userForm.value.emailAddress,
                    homeAddress: this.userForm.value.homeAddress,
                    zoneId:
                        this.userForm.value.zoneId ||
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
            };
            this.isLoading.next(true);
            this.userService
                .register(registerPayload)
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
                            title: 'Your user details have been saved.',
                        });

                        this.route.navigate(['/admin/users/', data.body.id]);
                    },
                    (error) => {
                        SWALMIXIN.fire({
                            icon: 'error',
                            title: error.errorMessage
                                ? error.errorMessage
                                : error.error.errorMessage,
                        });
                    }
                );
        }
    }

    toggleDrawer() {
        this.userComponent.matDrawer.toggle();
    }
}
