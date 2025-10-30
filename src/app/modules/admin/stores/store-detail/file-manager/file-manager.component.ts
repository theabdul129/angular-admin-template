import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StoreDetailComponent } from '../store-detail.component';
import { StoreLocation } from "app/models/location";
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { StoreInventoryService } from '../inventory/store.inventory.service';
import { SWALMIXIN } from 'app/core/services/mixin.service';

@Component({
    selector: 'store-file-manager',
    templateUrl: './file-manager.component.html'
})
export class FileManagerComponent implements OnInit, OnDestroy {

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    accountId: any;
    accountData: any;
    storeCurrentLocation: StoreLocation;
    selectedStoreId: number;
    subscription: Subscription;
    selectedStore: any;
    urlGenerationPath: string;

    constructor(
        public dialog: MatDialog,
        private storeComponent: StoreDetailComponent,
        private storeInventoryService: StoreInventoryService,
        private route: Router,
    ) { }

    ngOnInit() {
        let storeId = this.route.url.split(['/'][0]);
        this.selectedStoreId = Number(storeId[4]);
        this.urlGenerationPath = '/storeInventory/' + this.selectedStoreId + '/generateUrl';
    }

    fileUploaded($event) {
        this.storeInventoryService
            .addProductFile({ fileUrl: $event }, this.selectedStoreId)
            .subscribe(data => {
                if(data.status != 200) return;
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'Uploaded sucessfully',
                });
            }, error => {
                SWALMIXIN.fire({
                    icon: 'error',
                    title: error.error.errorMessage,
                });
            });
    }

    toggleDrawer() {
        this.storeComponent.matDrawer.toggle();
    }

    ngOnDestroy() {
    }

}