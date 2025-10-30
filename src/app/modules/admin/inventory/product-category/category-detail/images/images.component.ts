import { Component, NgZone, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductCategoryDetailComponent } from '../category-detail.component';
import { ProductCategory } from 'app/models/productcategory';
import { ProductCategoryService } from '../../category.service';
import { ProductImage } from 'app/models/productimage';
import { Location } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
@Component({
    selector: 'product-categoryImages',
    templateUrl: './images.component.html',
})
export class ProductCategoryImagesComponent implements OnInit {
    userForm: UntypedFormGroup;

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    panelOpenState = false;
    selectedProductCategory: ProductCategory;
    categoryId: any;
    contentType = 'category';
    childProductCategories: [ProductCategory];
    selectedChildProductCategory: ProductCategory;
    selectedProductImage: ProductImage;

    constructor(
        private route: Router,
        public dialog: MatDialog,
        private categoryComponent: ProductCategoryDetailComponent,
        private productCategoryService: ProductCategoryService,
        private location: Location,
        private ngZone: NgZone
    ) {}

    ngOnInit() {
        if(window.innerWidth<769)this.toggleDrawer();
        let id = this.route.url.split(['/'][0]);
        this.categoryId = Number(id[3]);
        if (this.categoryId) this.loadProductCategory();
        else this.location.back();
    }

    loadProductCategory() {
        this.isLoading.next(true);
        this.productCategoryService
            .get(this.categoryId)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            )
            .subscribe((data) => {
                this.selectedProductCategory = data;
                if (!data.imageUrl) {
                    this.selectedProductCategory.imageUrl = data.imageUrl;
                    this.selectedProductCategory.publicImageUrl =
                        data.publicImageUrl;
                }
            });
    }

    toggleDrawer() {
        this.categoryComponent.matDrawer.toggle();
    }

    onSubmit(fileName) {
        this.selectedProductCategory = {
            ...this.selectedProductCategory,
            imageUrl: fileName,
        };

        this.productCategoryService
            .save(this.selectedProductCategory, this.categoryId)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            )
            .subscribe((data) => {
                this.selectedProductCategory = data;
                if (!data.imageUrl) {
                    this.selectedProductCategory.imageUrl = data.imageUrl;
                    this.selectedProductCategory.publicImageUrl =
                        data.publicImageUrl;
                }
            });
    }
}
