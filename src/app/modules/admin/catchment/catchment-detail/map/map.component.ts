import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CatchmentDetailComponent } from '../catchment-detail.component';
import { CatchmentAreaService } from '../../catchment.area.service';
import { CatchmentArea } from 'app/models/catchmentarea';
import { BehaviorSubject, Observable } from 'rxjs';
import { StoreLocation } from 'app/models/location';
// import { MouseEvent } from '@agm/core';
import { Location } from '@angular/common';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { finalize } from 'rxjs/operators';

declare const google: any;

@Component({
    selector: 'basic-catchmentMap',
    templateUrl: './map.component.html',
})
export class CatchmentMapComponent implements OnInit {
    catchmentID: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();

    isLoadedPosition: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    );
    public isLoadedPositionObs: Observable<boolean> =
        this.isLoadedPosition.asObservable();

    catchmentForm: UntypedFormGroup;
    selectedCatchmentArea: CatchmentArea;
    mapPolygon: any;
    location: StoreLocation;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: Router,
        public dialog: MatDialog,
        private catchmentComponent: CatchmentDetailComponent,
        private catchmentAreaService: CatchmentAreaService,
        private routeLocation: Location
    ) {
        this.catchmentForm = this.formBuilder.group({
            name: [null, Validators.compose([Validators.required])],
            depotLocation: [null, Validators.compose([Validators.required])],
            points: [null, Validators.compose([Validators.required])],
            availableFrom: [null],
            maxOrderTravelTime: '',
            maxRouteTime: '',
            maxWaitingTime: '',
            maxOutOfCatchmentDistance: '',
        });
    }

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.catchmentID = Number(id[3]);
        this.catchmentID ? this.loadCatchment() : this.routeLocation.back();
        this.isLoadedPosition.next(true);

        //
    }

    loadCatchment() {
        this.isLoading.next(true);
        this.catchmentAreaService
            .get(this.catchmentID)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            )
            .subscribe((data) => {
                this.selectedCatchmentArea = data;

                this.catchmentForm.patchValue({
                    name: this.selectedCatchmentArea.name,
                    depotLocation: this.selectedCatchmentArea.depotLocation,
                    maxOrderTravelTime:
                        this.selectedCatchmentArea.maxOrderTravelTime,
                    maxRouteTime: this.selectedCatchmentArea.maxRouteTime,
                    maxWaitingTime: this.selectedCatchmentArea.maxWaitingTime,
                    maxOutOfCatchmentDistance:
                        this.selectedCatchmentArea.maxOutOfCatchmentDistance,
                });

                if (
                    this.selectedCatchmentArea.area &&
                    this.selectedCatchmentArea.area.coordinates?.length
                ) {

                    this.catchmentForm.patchValue({
                        points: this.selectedCatchmentArea.area.coordinates[0].map(
                            (s) => ({
                                latitude: s[0],
                                longitude: s[1],
                            })
                        ),
                    });
                }

                if (this.selectedCatchmentArea.availableFrom) {
                    this.catchmentForm.patchValue({
                        availableFrom: this.selectedCatchmentArea.availableFrom,
                    });
                }

                if (this.selectedCatchmentArea.depotLocation) {
                    this.location = {
                        latitude:
                            this.selectedCatchmentArea.depotLocation.latitude,
                        longitude:
                            this.selectedCatchmentArea.depotLocation.longitude,
                        mapType: 'roadmap',
                        zoom: 8,
                        markers: [
                            {
                                lat: this.selectedCatchmentArea.depotLocation
                                    .latitude,
                                lng: this.selectedCatchmentArea.depotLocation
                                    .longitude,
                                label: '',
                                id: -10,
                            },
                        ],
                    };
                } else {
                    this.setCurrentPosition();
                }
            });
    }

    toggleDrawer() {
        this.catchmentComponent.matDrawer.toggle();
    }

    setCurrentPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;

                console.log(position.coords);
                this.catchmentForm.patchValue({
                    depotLocation: {
                        latitude: latitude,
                        longitude: longitude,
                    },
                });

                this.location = {
                    latitude,
                    longitude,
                    mapType: 'roadmap',
                    zoom: 8,
                    markers: [
                        {
                            lat: latitude,
                            lng: longitude,
                            label: '',
                            id: -10,
                        },
                    ],
                };
            });
        } else {
            console.log(
                'Geolocation is not supported by this browser, please use google chrome.'
            );
        }
    }

    markerDragEnd($event: MouseEvent) {
        this.catchmentForm.patchValue({
            depotLocation: {
                // latitude: $event.coords.lat,
                // longitude: $event.coords.lng,
            },
        });
    }

    onMapReady(map) {
        this.initDrawingManager(map);
    }

    initDrawingManager(map: any) {
        const options = {
            drawingControl: true,
            drawingControlOptions: {
                drawingModes: ['polygon'],
            },
            polygonOptions: {
                draggable: true,
                editable: true,
            },
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
        };

        const drawingManager = new google.maps.drawing.DrawingManager(options);
        drawingManager.setMap(map);

        google.maps.event.addListener(
            drawingManager,
            'overlaycomplete',
            (event) => {
                // Polygon drawn
                if (event.type === google.maps.drawing.OverlayType.POLYGON) {
                    //this is the coordinate, you can assign it to a variable or pass into another function.

                    this.mapPolygon = event.overlay;

                    const points = event.overlay
                        .getPath()
                        .getArray()
                        .map((p) => ({
                            longitude: p.lng(),
                            latitude: p.lat(),
                        }));

                    this.catchmentForm.patchValue({
                        points: points,
                    });
                }
            }
        );


        this.catchmentAreaService
            .getArea(this.catchmentID)
            .subscribe((data) => {
                console.log(data)
                map.data.addGeoJson(data);
            });
    }

    resetPoints() {
        this.catchmentForm.patchValue({
            points: [],
        });

        this.setCurrentPosition();

        if (this.mapPolygon) {
            this.mapPolygon.setMap(null);
        }
    }

    saveData() {
        this.isLoading.next(true);

        const payload: CatchmentArea = {
            id: this.selectedCatchmentArea.id,
            name: this.catchmentForm.controls.name.value,
            depotLocation: this.catchmentForm.controls.depotLocation.value,
            availableFrom: this.catchmentForm.controls.availableFrom.value,
            points: this.catchmentForm.controls.points.value,
            maxWaitingTime: this.catchmentForm.controls.maxWaitingTime.value,
            maxOrderTravelTime:
                this.catchmentForm.controls.maxOrderTravelTime.value,
            maxRouteTime: this.catchmentForm.controls.maxRouteTime.value,
            maxOutOfCatchmentDistance:
                this.catchmentForm.controls.maxOutOfCatchmentDistance.value,
        };
        this.catchmentAreaService.save(payload, this.catchmentID).subscribe(
            (data) => {
                if (data.status != 200) return;
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'Your map details have been saved.',
                });
                this.isLoading.next(false);
                this.ngOnInit();
            },
            (error) => {
                this.isLoading.next(false);
                SWALMIXIN.fire({
                    icon: 'error',
                    title: error.error.errorMessage,
                });
            }
        );
    }
}
