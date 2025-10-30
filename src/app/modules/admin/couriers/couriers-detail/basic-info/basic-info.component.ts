import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { CourierrDetailComponent } from '../couriers-detail.component';
import { Courier } from 'app/models/courier';
import { CourierService } from '../../courier.service';
import { WebSocketService } from 'app/core/services/websocket.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { StoreLocation } from 'app/models/location';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input-gg';
import { CatchmentAreaService } from 'app/modules/admin/catchment/catchment.area.service';
@Component({
    selector: 'basic-courierDetail',
    templateUrl: './basic-info.component.html'
})
export class CourierBasicDetailComponent implements OnInit {

    userForm: UntypedFormGroup;
    contactUserForm: UntypedFormGroup;
    customerId: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    @Input() selectedCourier: Courier;
    courierCurrentLocation: StoreLocation;
    routes: any[] = [];
    courierId: any;
    separateDialCode = false;
    SearchCountryField = SearchCountryField;
    CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;
    preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
    formSubmitted: boolean = false;
    catchmentAreas: any;
    invalidFields: any[] = [];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: Router,
        public dialog: MatDialog,
        private courierComponent: CourierrDetailComponent,
        private courierService: CourierService,
        private webSocketService: WebSocketService,
        private catchmentService: CatchmentAreaService
    ) {
        this.userForm = this.formBuilder.group({
            emailAddress: ["", [Validators.required, Validators.email]],
            primaryPhone: ["", Validators.required],
            firstName: ["", Validators.required],
            surname: [""],
            address: ["", Validators.required],
            jobAllocationStrategy: ["", Validators.required],
            commuteProfile: [''],
            acceptingOrders: [''],
            hourlyPaymentSchedule: [''],
            catchmentArea: []
        });
    }

    ngOnInit() {
        this.catchmentService.getAll(0, 500).subscribe(data => this.catchmentAreas = data.data);
        let id = this.route.url.split(['/'][0]);
        this.courierId = Number(id[3]);
        if (this.courierId) this.loadCourier();
        this.courierCurrentLocation = {
            latitude: 0,
            longitude: 0,
            mapType: "satelite",
            zoom: 8,
            marker: null,
            markers: []
        };
    }

    loadCourier() {
        this.isLoading.next(true);
        this.courierService.get(this.courierId).subscribe(data => {
            this.isLoading.next(false);
            this.selectedCourier = data;
            this.userForm.patchValue({
                id: this.selectedCourier.id,
                firstName: this.selectedCourier.userDetail.firstName,
                surname: this.selectedCourier.userDetail.surname,
                primaryPhone: this.selectedCourier.userDetail.primaryPhone,
                address: this.selectedCourier.userDetail.homeAddress,
                emailAddress: this.selectedCourier.userDetail.emailAddress,
                jobAllocationStrategy: this.selectedCourier.jobAllocationStrategy,
                commuteProfile: this.selectedCourier.commuteProfile,
                acceptingOrders: this.selectedCourier.acceptingOrders,
                hourlyPaymentSchedule: this.selectedCourier.hourlyPaymentSchedule,
                catchmentArea: this.selectedCourier.catchmentArea.id
            });
            if (this.selectedCourier.lastKnownLocation != undefined) {
                this.courierCurrentLocation.latitude = this.selectedCourier?.lastKnownLocation.latitude;
                this.courierCurrentLocation.longitude = this.selectedCourier?.lastKnownLocation.longitude;
            }
            this.webSocketService.init(
                pos => {
                    if (this.selectedCourier.lastKnownLocation == undefined) {
                        this.selectedCourier.lastKnownLocation = {
                            latitude: pos.location.latitude,
                            longitude: pos.location.longitude
                        };
                    }
                    this.selectedCourier.lastKnownLocation.createdAt = pos.location.createdAt;
                    this.courierCurrentLocation.latitude = pos.location.latitude;
                    this.courierCurrentLocation.longitude = pos.location.longitude;
                },
                "",
                "/topic/whereabouts/" + this.courierId
            );
            this.webSocketService.connect();
        });
    }

    approve() {
        this.isLoading.next(true);
        this.courierService.approveCourier(this.selectedCourier.id).pipe(
            finalize(() => {
                this.isLoading.next(false);
            })
        ).subscribe(data => {
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your courier has been updated.',
            });
            this.loadCourier();
        })
    }

    disable() {
        this.isLoading.next(true);
        this.courierService.disableCourier(this.selectedCourier.id).pipe(
            finalize(() => {
                this.isLoading.next(false);
            })
        ).subscribe(data => {
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your courier has been updated.',
            });
            this.loadCourier();
        })
    }

    onSubmit() {
        this.invalidFields = [];
        if(this.userForm.controls.primaryPhone.invalid) this.userForm.controls.primaryPhone.markAsTouched();
        this.formSubmitted = true;
        const controls = this.userForm.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                this.invalidFields.push(name);
            }
        }
        const isInvalid = (!this.userForm.controls.address.value.address1 || !this.userForm.controls.address.value.city);
        if (isInvalid) {
            if (this.invalidFields.indexOf('address') < 0) this.invalidFields.push('address');
            this.userForm.controls['address'].setErrors({ 'incorrect': true });
        }
        if (this.userForm.invalid || isInvalid) return;
        const registerPayload: Courier = {
            userDetail: {
                primaryPhone: this.userForm.controls.primaryPhone.value.internationalNumber,
                firstName: this.userForm.controls.firstName.value,
                surname: this.userForm.controls.surname.value,
                emailAddress: this.userForm.controls.emailAddress.value,
                zoneId: Intl.DateTimeFormat().resolvedOptions().timeZone,
                homeAddress: this.userForm.controls.address.value,
            },
            commuteProfile: this.userForm.controls.commuteProfile.value,
            hourlyPaymentSchedule: Boolean(this.userForm.controls.hourlyPaymentSchedule.value),
            catchmentArea: { id: this.userForm.controls.catchmentArea.value },
            acceptingOrders: this.userForm.controls.acceptingOrders.value,
            id: this.selectedCourier ? this.selectedCourier.id : null,
            jobAllocationStrategy: this.userForm.controls.jobAllocationStrategy.value
        };

        if (registerPayload.id > 0) {
            this.isLoading.next(true);
            this.courierService.update(registerPayload, this.selectedCourier.id)
                .pipe(
                    finalize(() => {
                        this.isLoading.next(false);
                        this.formSubmitted = false;
                    })
                ).subscribe(data => {
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Your courier has been updated.',
                    });
                    this.loadCourier();
                }, error => {
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                })
        } else {
            this.isLoading.next(true);
            this.courierService.register(registerPayload)
                .pipe(
                    finalize(() => {
                        this.isLoading.next(false);
                        this.formSubmitted = false;
                    })
                ).subscribe(data => {
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Your courier details have been saved.',
                    });
                    this.route.navigate(['/admin/couriers/', data.body.id]);
                }, error => {
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                })
        }
    }

    toggleDrawer() {
        this.courierComponent.matDrawer.toggle();
    }

}