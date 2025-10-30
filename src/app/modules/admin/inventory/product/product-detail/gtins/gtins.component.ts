import { Location } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { Product } from 'app/models/product';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { InventoryService } from '../../../inventory.service';
import { ProductDetailComponent } from '../product-detail.component';

@Component({
    selector: 'product-gtins',
    templateUrl: './gtins.component.html'
})
export class GtinsComponent implements OnInit {

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    selectedProduct: Product;
    productId: any;
    gtinForm: UntypedFormGroup;
    dataSource: any;
    errorMsg: any;
    displayedColumns: string[] = ['sr', 'gtin', 'type', 'loc', 'price', 'action'];
    formSubmitted: boolean = false;
    gtinTypes = ['UPCA', 'UPCE', 'EAN13', 'EAN8', 'JAN13', 'ISBN', 'ISSN', 'CODE39', 'CODE93', 'CODE128', 'ITF', 'Codabar', 'AmeCode', 'NW7', 'Monarch', 'Code2of7', 'RationalizedCodabar', 'ANSIBC31995', 'ANSIAIMBC31995', 'USD4', 'GS1', 'MSIPlessey', 'QR', 'Datamatrix', 'PDF417', 'Aztec']

    constructor(
        public dialog: MatDialog,
        private productComponent: ProductDetailComponent,
        private inventory: InventoryService,
        private route: Router,
        private formBuilder: UntypedFormBuilder,
        private location: Location,
        private ngZone: NgZone
    ) {
        this.gtinForm = this.formBuilder.group({
            gtin: [null, Validators.compose([Validators.required])],
            type: [''],
            location: ['', Validators.required],
            priceMarked: false
        });
    }

    ngOnInit() {
        let storeId = this.route.url.split(['/'][0]);
        this.productId = Number(storeId[4]);
        if (this.productId) this.loadProduct();
        else this.location.back();
    }

    loadProduct() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.inventory.get(this.productId).subscribe(data => {
            this.ngZone.run(() => {
                this.isLoading.next(false);
                this.selectedProduct = data;
                this.dataSource.data = this.selectedProduct.gtins;
            })
        }, error => this.isLoading.next(false));
    }

    toggleDrawer() {
        this.productComponent.matDrawer.toggle();
    }

    onAddGtin() {
        this.formSubmitted = true;
        if (this.gtinForm.invalid) return;
        const payload = {
            productId: this.selectedProduct.id,
            gtin: this.gtinForm.controls.gtin.value,
            priceMarked: this.gtinForm.controls.priceMarked.value,
            type: this.gtinForm.controls.type.value,
            location: this.gtinForm.controls.location.value,
        };
        this.isLoading.next(true);
        this.inventory
            .addGtin(payload, this.selectedProduct.id)
            .subscribe(data => {
                this.closeModal();
                this.formSubmitted = false;
                if (data.status != 200) return;
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'Your GTN details have been saved.',
                });
                this.loadProduct();
                this.gtinForm.reset();
            }, error => {
                this.closeModal();
                this.isLoading.next(false);
                SWALMIXIN.fire({
                    icon: 'error',
                    title: error.error.errorMessage,
                });
            });
    }

    onRemoveGtin(gtin) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.isLoading.next(true);
                this.inventory
                    .removeGtin(gtin, this.selectedProduct.id)
                    .subscribe(data => {
                        if (data.status != 200) return;
                        this.isLoading.next(false);
                        SWALMIXIN.fire({
                            icon: 'success',
                            title: 'Removed successfuly.',
                        });
                        this.loadProduct();
                    }, error => {
                        this.isLoading.next(false);
                        SWALMIXIN.fire({
                            icon: 'error',
                            title: error.error.errorMessage,
                        });
                    });
            }
        });
    }

    openModal(modal) {
        this.dialog.open(modal, { width: '600px' });
    }

    closeModal() {
        this.dialog.closeAll();
    }

}