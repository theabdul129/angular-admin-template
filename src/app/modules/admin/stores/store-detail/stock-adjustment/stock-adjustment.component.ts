import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { StoreService } from '../../store.service';
import { StoreDetailComponent } from '../store-detail.component';

@Component({
    selector: 'stock-adjustment',
    templateUrl: './stock-adjustment.component.html'
})
export class StockAdjustmentComponent implements OnInit {

    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['id', 'name', 'created', 'term', 'action'];
    dataSource: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    storeId: any;
    errorMsg: any;
    totalAccounts: any;
    form: UntypedFormGroup;
    stockId: any;
    stockAction: any;
    stockData = {
        "currentPage": 0,
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
        ],
        "pageSize": 0,
        "totalPages": 0,
        "totalSize": 1
    }

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
        if (this.storeId) this.loadData();
    }

    loadData() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.storeService.getStocks(this.storeId, this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize)
            .subscribe((data: any) => {
                this.dataSource.data = this.stockData.data;
                this.dataSource.paginator = this.paginator;
                this.totalAccounts = this.stockData.totalSize;
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

    decline(id) {
        this.isLoading.next(true);
        this.storeService
            .deleteStock(this.storeId, id, this.form.value)
            .subscribe(data => {
                this.closeModal();
                if (data.status != 200) return;
                this.isLoading.next(false);
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'Declined successfuly.',
                });
                this.loadData();
            }, error => {
                this.closeModal();
                this.isLoading.next(false);
                SWALMIXIN.fire({
                    icon: 'error',
                    title: error.error.errorMessage,
                });
            });
    }

    accept(id) {
        this.isLoading.next(true);
        this.storeService
            .updateStock(this.storeId, id, this.form.value)
            .subscribe(data => {
                this.closeModal();
                if (data.status != 200) return;
                this.isLoading.next(false);
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'Accepted successfuly.',
                });
                this.loadData();
            }, error => {
                this.closeModal();
                this.isLoading.next(false);
                SWALMIXIN.fire({
                    icon: 'error',
                    title: error.error.errorMessage,
                });
            });
    }

    onSubmit() {
        this.stockAction == 'accept' ? this.accept(this.stockId) : this.decline(this.stockId);
    }

    openModal(modal, id, type) {
        this.dialog.open(modal, { width: '500px' });
        this.stockId = id;
        this.stockAction = type;
    }

    closeModal() {
        this.dialog.closeAll();
    }
}