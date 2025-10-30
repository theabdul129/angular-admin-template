import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { CatchmentDetailComponent } from '../catchment-detail.component';
import { CatchmentAreaService } from '../../catchment.area.service';
import { CatchmentArea } from 'app/models/catchmentarea';
import { BehaviorSubject, Observable } from 'rxjs';
import { StoreLocation } from 'app/models/location';
declare const google: any;

@Component({
    selector: 'basic-catchmentDetail',
    templateUrl: './basic-info.component.html'
})
export class CatchmentBasicDetailComponent implements OnInit {

    catchmentID: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    catchmentForm: UntypedFormGroup;
    selectedCatchmentArea: CatchmentArea;
    mapPolygon: any;
    location: StoreLocation;
    formSubmitted: boolean = false;
    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: Router,
        public dialog: MatDialog,
        private catchmentComponent: CatchmentDetailComponent,
        private catchmentAreaService: CatchmentAreaService,
    ) {
        this.catchmentForm = this.formBuilder.group({
            name: [null, Validators.compose([Validators.required])],
            depotLocation: [null],
            points: [null],
            availableFrom: [''],
            maxOrderTravelTime: '',
            maxRouteTime: '',
            maxWaitingTime: '',
            maxOutOfCatchmentDistance: '',
            deliverySlotDuration: '',
            deliverySlotCutOfTime: ''
        });
    }

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.catchmentID = Number(id[3]);
        if (this.catchmentID) this.loadCatchment();
    }

    loadCatchment() {
        this.isLoading.next(true);
        this.catchmentAreaService.get(this.catchmentID).subscribe(data => {
            this.isLoading.next(false);
            this.selectedCatchmentArea = data;
            this.catchmentForm.patchValue({
                name: this.selectedCatchmentArea.name,
                depotLocation: this.selectedCatchmentArea.depotLocation,
                maxOrderTravelTime: this.selectedCatchmentArea.maxOrderTravelTime,
                maxRouteTime: this.selectedCatchmentArea.maxRouteTime,
                maxWaitingTime: this.selectedCatchmentArea.maxWaitingTime,
                maxOutOfCatchmentDistance: this.selectedCatchmentArea.maxOutOfCatchmentDistance,
                deliverySlotDuration: String(this.selectedCatchmentArea.deliverySlotDuration),
                deliverySlotCutOfTime: this.selectedCatchmentArea.deliverySlotCutOfTime
            });
            if (data.area) {
                this.catchmentForm.patchValue({
                    points: this.selectedCatchmentArea.area.coordinates[0].map(s => ({
                        latitude: s[0],
                        longitude: s[1]
                    }))
                });
            }
            if (this.selectedCatchmentArea.availableFrom) {
                this.catchmentForm.patchValue({
                    availableFrom: this.selectedCatchmentArea.availableFrom
                });
            }
        });
    }

    toggleDrawer() {
        this.catchmentComponent.matDrawer.toggle();
    }

    onSubmit() {
        this.formSubmitted = true;
        if (this.catchmentForm.invalid) return;
        const id = this.selectedCatchmentArea ? this.selectedCatchmentArea.id : 0;
        const payload: CatchmentArea = {
            id,
            name: this.catchmentForm.controls.name.value,
            depotLocation: this.catchmentForm.controls.depotLocation.value,
            availableFrom: this.catchmentForm.controls.availableFrom.value,
            points: this.catchmentForm.controls.points.value,
            maxWaitingTime: this.catchmentForm.controls.maxWaitingTime.value,
            maxOrderTravelTime: this.catchmentForm.controls.maxOrderTravelTime.value,
            maxRouteTime: this.catchmentForm.controls.maxRouteTime.value,
            maxOutOfCatchmentDistance: this.catchmentForm.controls.maxOutOfCatchmentDistance.value,
            deliverySlotDuration: Number(this.catchmentForm.controls.deliverySlotDuration.value),
            deliverySlotCutOfTime: Number(this.catchmentForm.controls.deliverySlotCutOfTime.value)
        };
        this.isLoading.next(true);
        this.catchmentAreaService.save(payload, id).subscribe(data => {
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your catchment details have been saved.',
            });
            this.isLoading.next(false);
            id == 0 ? this.route.navigate(['/admin/catchment/', data.body.id]) : this.loadCatchment();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }
}