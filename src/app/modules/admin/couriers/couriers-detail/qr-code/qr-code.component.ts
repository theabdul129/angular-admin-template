import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CourierrDetailComponent } from '../couriers-detail.component';
import { CourierService } from '../../courier.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'basic-courierQRcode',
    templateUrl: './qr-code.component.html'
})

export class CourierQRCodeComponent implements OnInit {

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    courierId: any;
    selectedCourier: any;

    constructor(
        private route: Router,
        public dialog: MatDialog,
        private courierComponent: CourierrDetailComponent,
        private courierService: CourierService,
    ) { }

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.courierId = Number(id[3]);
        if (this.courierId) this.loadCourier();
    }

    loadCourier() {
        this.isLoading.next(true);
        this.courierService.get(this.courierId)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            ).subscribe(data => {
                this.selectedCourier = data;
            });
    }

    toggleDrawer() {
        this.courierComponent.matDrawer.toggle();
    }

}