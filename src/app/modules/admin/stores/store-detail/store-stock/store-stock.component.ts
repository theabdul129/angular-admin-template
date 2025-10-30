import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { StoreService } from '../../store.service';
import { StoreDetailComponent } from '../store-detail.component';

@Component({
    selector: 'store-stock',
    templateUrl: './store-stock.component.html'
})
export class StoreStockComponent implements OnInit {

    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['id', 'name', 'created', 'term'];
    dataSource: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    storeId: any;
    errorMsg: any;
    totalAccounts: any;
    form: UntypedFormGroup;
    productId: any;
    stockAction: any;
    stockData = {
        "currentPage": 0,
        "data": [
            {
              "bestBefore": "2021-12-09T08:34:09.818Z",
              "createdAt": "2021-12-09T08:34:09.818Z",
              "inventoryMatcher": "gtin",
              "product": {
                "ageRestriction": true,
                "categoryName": "string",
                "createdAt": "2021-12-09T08:34:09.818Z",
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
                  "approvedAt": "2021-12-09T08:34:09.818Z",
                  "archivedAt": "2021-12-09T08:34:09.818Z",
                  "createdAt": "2021-12-09T08:34:09.818Z",
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
                  "updatedAt": "2021-12-09T08:34:09.818Z"
                },
                "publicImageUrl": "string",
                "sizeDescription": "string"
              },
              "stockChangeCount": 0,
              "stockLocation": {
                "aisle": 0,
                "col": 0,
                "id": 0,
                "row": 0,
                "section": 0
              },
              "stockTotalCount": 0,
              "supplierPurchaseOrderProduct": {
                "bestBefore": "2021-12-09T08:34:09.818Z",
                "id": 0,
                "productPrice": {
                  "createdAt": "2021-12-09T08:34:09.818Z",
                  "currency": "string",
                  "id": 0,
                  "product": {
                    "id": 0,
                    "notes": "string",
                    "product": {
                      "ageRestriction": true,
                      "categoryName": "string",
                      "createdAt": "2021-12-09T08:34:09.818Z",
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
                        "approvedAt": "2021-12-09T08:34:09.818Z",
                        "archivedAt": "2021-12-09T08:34:09.818Z",
                        "createdAt": "2021-12-09T08:34:09.818Z",
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
                        "updatedAt": "2021-12-09T08:34:09.818Z"
                      },
                      "publicImageUrl": "string",
                      "sizeDescription": "string"
                    },
                    "sku": "string"
                  },
                  "tax": {
                    "country": {
                      "code": "string",
                      "country": "string",
                      "countryCode": "string",
                      "currency": "string",
                      "dialingCode": "string",
                      "id": 0
                    },
                    "description": "string",
                    "id": 0,
                    "inclusive": true,
                    "rate": 0,
                    "type": "Custom",
                    "typeOther": "string"
                  },
                  "unitPrice": 0,
                  "validFrom": "2021-12-09T08:34:09.818Z",
                  "validTo": "2021-12-09T08:34:09.819Z"
                },
                "purchaseOrder": {
                  "archivedAt": "2021-12-09T08:34:09.819Z",
                  "completedAt": "2021-12-09T08:34:09.819Z",
                  "createdAt": "2021-12-09T08:34:09.819Z",
                  "deliveredAt": "2021-12-09T08:34:09.819Z",
                  "deliveredBy": "2021-12-09T08:34:09.819Z",
                  "deliveryTerm": {
                    "createdAt": "2021-12-09T08:34:09.819Z",
                    "currency": "string",
                    "description": "string",
                    "id": 0,
                    "sku": "string",
                    "unitPrice": 0,
                    "validFrom": "2021-12-09T08:34:09.819Z",
                    "validTo": "2021-12-09T08:34:09.819Z"
                  },
                  "dispatchedAt": "2021-12-09T08:34:09.819Z",
                  "id": 0,
                  "invoiceNumber": "string",
                  "notes": "string",
                  "purchaseOrderNumber": "string",
                  "store": {
                    "approvedAt": "2021-12-09T08:34:09.819Z",
                    "createdAt": "2021-12-09T08:34:09.819Z",
                    "declinedAt": "2021-12-09T08:34:09.819Z",
                    "description": "string",
                    "id": 0,
                    "name": "string",
                    "profileImagePublicUrl": "string",
                    "profileImageUrl": "string",
                    "storeAddress": {
                      "address1": "string",
                      "address2": "string",
                      "city": "string",
                      "id": 0,
                      "latitude": 0,
                      "longitude": 0,
                      "phoneNumber": "string",
                      "placeId": "string",
                      "postcode": "string",
                      "region": "string"
                    },
                    "website": "string"
                  },
                  "supplierNotes": "string",
                  "term": {
                    "accountNumber": "string",
                    "archivedAt": "2021-12-09T08:34:09.819Z",
                    "businessAccount": {
                      "accountNumber": "string",
                      "address": {
                        "address1": "string",
                        "address2": "string",
                        "city": "string",
                        "id": 0,
                        "latitude": 0,
                        "longitude": 0,
                        "phoneNumber": "string",
                        "placeId": "string",
                        "postcode": "string",
                        "region": "string"
                      },
                      "companyNumber": "string",
                      "description": "string",
                      "friendlyName": "string",
                      "id": 0,
                      "legalName": "string",
                      "publicImageUrl": "string"
                    },
                    "contacts": [
                      {
                        "address": {
                          "address1": "string",
                          "address2": "string",
                          "city": "string",
                          "id": 0,
                          "latitude": 0,
                          "longitude": 0,
                          "phoneNumber": "string",
                          "placeId": "string",
                          "postcode": "string",
                          "region": "string"
                        },
                        "emailAddress": "string",
                        "firstName": "string",
                        "id": 0,
                        "position": "string",
                        "surname": "string"
                      }
                    ],
                    "createdAt": "2021-12-09T08:34:09.819Z",
                    "deliveryTerms": [
                      {
                        "createdAt": "2021-12-09T08:34:09.819Z",
                        "currency": "string",
                        "description": "string",
                        "id": 0,
                        "sku": "string",
                        "unitPrice": 0,
                        "validFrom": "2021-12-09T08:34:09.819Z",
                        "validTo": "2021-12-09T08:34:09.819Z"
                      }
                    ],
                    "id": 0,
                    "notes": "string",
                    "paymentTerm": {
                      "description": "string",
                      "id": 0,
                      "term": "string"
                    }
                  }
                },
                "quantity": 0,
                "quantityReceived": 0
              }
            },
            {
                "bestBefore": "2021-12-09T08:34:09.818Z",
                "createdAt": "2021-12-09T08:34:09.818Z",
                "inventoryMatcher": "gtin",
                "product": {
                  "ageRestriction": true,
                  "categoryName": "string",
                  "createdAt": "2021-12-09T08:34:09.818Z",
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
                    "approvedAt": "2021-12-09T08:34:09.818Z",
                    "archivedAt": "2021-12-09T08:34:09.818Z",
                    "createdAt": "2021-12-09T08:34:09.818Z",
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
                    "updatedAt": "2021-12-09T08:34:09.818Z"
                  },
                  "publicImageUrl": "string",
                  "sizeDescription": "string"
                },
                "stockChangeCount": 0,
                "stockLocation": {
                  "aisle": 0,
                  "col": 0,
                  "id": 0,
                  "row": 0,
                  "section": 0
                },
                "stockTotalCount": 0,
                "storeInventoryAdjustment": {
                  "approvedBy": {
                    "createdAt": "2021-12-09T08:34:09.818Z",
                    "firstName": "string",
                    "id": 0,
                    "profileImagePublicUrl": "string",
                    "profileImageUrl": "string",
                    "surname": "string"
                  },
                  "createdAt": "2021-12-09T08:34:09.818Z",
                  "createdBy": {
                    "createdAt": "2021-12-09T08:34:09.818Z",
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
                    "createdAt": "2021-12-09T08:34:09.818Z",
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
                      "approvedAt": "2021-12-09T08:34:09.818Z",
                      "archivedAt": "2021-12-09T08:34:09.818Z",
                      "createdAt": "2021-12-09T08:34:09.818Z",
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
                      "updatedAt": "2021-12-09T08:34:09.818Z"
                    },
                    "publicImageUrl": "string",
                    "sizeDescription": "string"
                  },
                  "quantity": 0,
                  "reason": "adminAdjustment",
                  "rejectedBy": {
                    "createdAt": "2021-12-09T08:34:09.818Z",
                    "firstName": "string",
                    "id": 0,
                    "profileImagePublicUrl": "string",
                    "profileImageUrl": "string",
                    "surname": "string"
                  }
                }
              }
          ],
        "pageSize": 0,
        "totalPages": 0,
        "totalSize": 2
    }
    productData: any;

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private storeService: StoreService,
        private route: Router,
        private storeComponent: StoreDetailComponent,
        private fb: UntypedFormBuilder,
        private dialog: MatDialog
    ) {
        this.form = this.fb.group({
            note: ['', Validators.required]
        })
    }

    ngOnInit() {
        let storeId = this.route.url.split(['/'][0]);
        this.storeId = Number(storeId[4]);
        this.productId = Number(storeId[6]);
        if (this.storeId) this.loadData();
    }

    loadData() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.storeService.getStoreStock(this.storeId, this.productId, this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize)
            .subscribe((data: any) => {
                this.productData = data.data[0].product;
                this.dataSource.data = data.data;
                this.dataSource.paginator = this.paginator;
                this.totalAccounts = data.totalSize;
                this.isLoading.next(false);
            }, error => {
                this.isLoading.next(false);
                this.errorMsg = error.message;
            })
    }

    paginate(event: PageEvent) {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadData();
    }

    toggleDrawer() {
        this.storeComponent.matDrawer.toggle();
    }
}