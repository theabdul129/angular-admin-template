import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StoreDetailComponent } from '../store-detail.component';
import { StoreLocation } from "app/models/location";
import { StoreService } from '../../store.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { StoreDataService } from '../store.data.service';

@Component({
    selector: 'store-OtherInfo',
    templateUrl: './other-info.component.html'
})
export class StoreOtherInfoComponent implements OnInit, OnDestroy {

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    accountId: any;
    accountData: any;
    storeCurrentLocation: StoreLocation;
    selectedStoreId: number;
    subscription: Subscription;
    selectedStore: any;

    constructor(
        public dialog: MatDialog,
        private storeComponent: StoreDetailComponent,
        private storeService: StoreService,
        private route: Router,
        private storeData: StoreDataService
    ) { }

    ngOnInit() {
        let storeId = this.route.url.split(['/'][0]);
        this.selectedStoreId = Number(storeId[4]);
        this.subscription = this.storeData.activeStore.subscribe((data: any) => {
            this.selectedStore = data;
        })
        if (!this.selectedStore) this.loadStore();
    }

    loadStore() {
        this.storeCurrentLocation = {
            latitude: 0,
            longitude: 0,
            mapType: "satelite",
            zoom: 8,
            marker: null,
            markers: []
        };
        this.isLoading.next(true);
        this.storeService.storeDetail(this.selectedStoreId).subscribe(data => {
            this.isLoading.next(false);
            this.selectedStore = data;
            this.storeCurrentLocation.latitude = this.selectedStore.storeAddress.latitude;
            this.storeCurrentLocation.longitude = this.selectedStore.storeAddress.longitude;
        });
    }

    toggleDrawer() {
        this.storeComponent.matDrawer.toggle();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
      }

}