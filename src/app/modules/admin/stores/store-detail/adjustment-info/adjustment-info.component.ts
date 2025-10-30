import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Location as LocationCommon } from "@angular/common";
import { StoreService } from '../../store.service';
import { StoreDetailComponent } from '../store-detail.component';
import { StoreDataService } from '../store.data.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
    selector: 'basic-adjustment',
    templateUrl: './adjustment-info.component.html'
})
export class AdjustmentDetailComponent implements OnInit {

    form: UntypedFormGroup;
    storeId: any;
    data = {
        "data": [
            {
                "approvedBy": {
                    "createdAt": "2021-12-01T04:29:35.931Z",
                    "firstName": "string",
                    "id": 0,
                    "profileImagePublicUrl": "string",
                    "profileImageUrl": "string",
                    "surname": "string"
                },
                "createdAt": "2021-12-01T04:29:35.931Z",
                "createdBy": {
                    "createdAt": "2021-12-01T04:29:35.931Z",
                    "firstName": "string",
                    "id": 0,
                    "profileImagePublicUrl": "string",
                    "profileImageUrl": "string",
                    "surname": "string"
                },
                "id": 0,
                "notes": "string",
                "product": {
                    "ageRestriction": true,
                    "categoryName": "string",
                    "createdAt": "2021-12-01T04:29:35.931Z",
                    "description": "string",
                    "gtins": [
                        {
                            "gtin": "string",
                            "location": "inner",
                            "priceMarked": true,
                            "type": "ANSIAIMBC31995"
                        }
                    ],
                    "id": 0,
                    "name": "string",
                    "productCategory": {
                        "approvedAt": "2021-12-01T04:29:35.931Z",
                        "archivedAt": "2021-12-01T04:29:35.931Z",
                        "createdAt": "2021-12-01T04:29:35.931Z",
                        "description": "string",
                        "id": 0,
                        "imageUrl": "string",
                        "name": "string",
                        "orderPosition": 0,
                        "popular": true,
                        "productCategoryImages": [
                            {
                                "description": "string",
                                "id": 0,
                                "publicUrl": "string",
                                "url": "string"
                            }
                        ],
                        "productCount": 0,
                        "publicImageUrl": "string",
                        "relatedCategories": [
                            null
                        ],
                        "subCategories": [
                            null
                        ],
                        "updatedAt": "2021-12-01T04:29:35.931Z"
                    },
                    "publicImageUrl": "string",
                    "sizeDescription": "string"
                },
                "quantity": 0,
                "reason": "adminAdjustment",
                "rejectedBy": {
                    "createdAt": "2021-12-01T04:29:35.931Z",
                    "firstName": "string",
                    "id": 0,
                    "profileImagePublicUrl": "string",
                    "profileImageUrl": "string",
                    "surname": "string"
                }
            }
        ]
    }
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();

    constructor(
        private fb: UntypedFormBuilder,
        private storeService: StoreService,
        private route: Router,
        public dialog: MatDialog,
        private locationCommon: LocationCommon,
        private storeComponent: StoreDetailComponent,
        private storeData: StoreDataService
    ) {
    }

    ngOnInit() {
        let storeId = this.route.url.split(['/'][0]);
        this.storeId = Number(storeId[4]);
        console.log('data',this.data)
    }

    toggleDrawer() {
        this.storeComponent.matDrawer.toggle();
    }

}