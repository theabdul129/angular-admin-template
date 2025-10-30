import { Location } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PackageDimension } from 'app/models/packagedimension';
import { Product } from 'app/models/product';
import { ProductImage } from 'app/models/productimage';
import { BehaviorSubject, Observable } from 'rxjs';
import { InventoryService } from '../../../inventory.service';
import { ProductDetailComponent } from '../product-detail.component';

@Component({
    selector: 'product-packages',
    templateUrl: './packages.component.html'
})
export class ProductPackages implements OnInit {

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    selectedProduct: Product;
    productId: any;
    selectedProductImage: ProductImage;
    errorMsg: any;
    selectedPackageDimension: PackageDimension;
    displayedColumns: string[] = ['sr', 'volume', 'weight', 'action'];

    constructor(
        public dialog: MatDialog,
        private productComponent: ProductDetailComponent,
        private route: Router,
        private inventory: InventoryService,
        private location: Location,
        private ngZone: NgZone
    ) { }

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.productId = Number(id[4]);
        if (this.productId) this.loadProduct();
        else this.location.back();
    }

    loadProduct() {
        this.isLoading.next(true);
        this.inventory.get(this.productId).subscribe(data => {
            this.ngZone.run(() => {
                this.isLoading.next(false);
                this.selectedProduct = data;
            })
        });
    }

    toggleDrawer() {
        this.productComponent.matDrawer.toggle();
    }

    closeModal() {
        this.dialog.closeAll();
    }

    openProductPackage(modal, dimension) {
        this.selectedPackageDimension = dimension;
        this.dialog.open(modal, { width: '650px' });
    }

    updateProductPackages() {
        this.loadProduct();
    }

}