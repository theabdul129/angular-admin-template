import { Location } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { Product } from 'app/models/product';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { InventoryService } from '../../../inventory.service';
import { ProductDetailComponent } from '../product-detail.component';

@Component({
    selector: 'related-products',
    templateUrl: './related-products.component.html'
})
export class RelatedProductComponent implements OnInit {

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    productId: any;
    relatedCategoryForm: UntypedFormGroup;
    selectedProduct: Product;
    errorMsg: any;
    displayedColumns: string[] = ['sr', 'name', 'action'];

    constructor(
        public dialog: MatDialog,
        private productComponent: ProductDetailComponent,
        private inventory: InventoryService,
        private route: Router,
        private formBuilder: UntypedFormBuilder,
        private location: Location
    ) {
        this.relatedCategoryForm = this.formBuilder.group({
            relatedProductCategory: [null, Validators.compose([Validators.required])]
        });
    }

    ngOnInit() {
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

    onAddRelatedCategory() {
        const payload = this.relatedCategoryForm.controls.relatedProductCategory.value;
        this.inventory
            .addRelatedProductCategory(payload, this.selectedProduct.id)
            .subscribe(data => {
                if (data.status != 200) return;
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'Your category details have been saved.',
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

    onRemoveRelatedCategory(productCategory) {
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
                    .removeRelatedProductCategory(productCategory.id, this.selectedProduct.id)
                    .subscribe(data => {
                        this.isLoading.next(false);
                        if (data.status != 200) return;
                        SWALMIXIN.fire({
                            icon: 'success',
                            title: 'Removed successfuly.s',
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

}