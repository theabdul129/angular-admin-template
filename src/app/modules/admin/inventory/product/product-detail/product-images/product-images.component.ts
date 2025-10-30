import { Location } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Product } from 'app/models/product';
import { ProductImage } from 'app/models/productimage';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { InventoryService } from '../../../inventory.service';
import { ProductDetailComponent } from '../product-detail.component';
import { SWALMIXIN } from 'app/core/services/mixin.service';

@Component({
    selector: 'product-images',
    templateUrl: './product-images.component.html',
})
export class ProductImagesComponent implements OnInit {
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    selectedProduct: Product;
    productId: any;
    selectedProductImage: ProductImage;

    constructor(
        public dialog: MatDialog,
        private productComponent: ProductDetailComponent,
        private route: Router,
        private inventory: InventoryService,
        private location: Location,
        private ngZone: NgZone
    ) { }

    ngOnInit() {
        if(window.innerWidth<769)this.toggleDrawer();
        let id = this.route.url.split(['/'][0]);
        this.productId = Number(id[4]);
        if (this.productId) this.loadProduct();
        else this.location.back();
    }

    loadProduct() {
        this.isLoading.next(true);
        this.inventory.get(this.productId).pipe(
            finalize(() => {
                this.isLoading.next(false);
            })
        ).subscribe((data: any) => {
            this.isLoading.next(false);
            this.selectedProduct = data;
        });
    }

    toggleDrawer() {
        this.productComponent.matDrawer.toggle();
    }

    openProductImage(modal, selectedProductImage) {        
        this.selectedProductImage = selectedProductImage;
        this.dialog.open(modal, { width: '500px',maxHeight:'80vh' });
    }

    updateProductImages() {
        this.loadProduct();
        this.inventory
            .productImages(this.selectedProduct.id)
            .subscribe((data) => {
                this.selectedProduct.productImages = data.data;
            });
    }

    closeModal() {
        this.dialog.closeAll();
    }

    onArchive(productId) {
        this.inventory.archiveProductImage(productId).subscribe(
            (data) => {
                if (data.status != 200) return;
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'Archived successfuly.',
                });
                this.loadProduct()
                this.closeModal()
            },
            (error) => {
                SWALMIXIN.fire({
                    icon: 'error',
                    title: error.error.errorMessage,
                });
            }
        );
    }
}
