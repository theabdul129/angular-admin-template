import { Component, NgZone, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductCategoryDetailComponent } from '../category-detail.component';
import { ProductCategory } from 'app/models/productcategory';
import { ProductCategoryService } from '../../category.service';
import { ProductImage } from 'app/models/productimage';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'basic-categoryDetail',
    templateUrl: './basic-info.component.html',
})
export class ProductBasicDetailComponent implements OnInit {
    userForm: UntypedFormGroup;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    panelOpenState = false;
    selectedProductCategory: ProductCategory;
    categoryId: any;
    childProductCategories: [ProductCategory];
    selectedChildProductCategory: ProductCategory;
    selectedProductImage: ProductImage;
    formSubmitted: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: Router,
        public dialog: MatDialog,
        private categoryComponent: ProductCategoryDetailComponent,
        private productCategoryService: ProductCategoryService,
        private ngZone: NgZone,
        private location: Location
    ) {
        this.userForm = this.formBuilder.group({
            name: [null, Validators.compose([Validators.required])],
            description: [null],
            parentProductCategory: [null],
            imageUrl: [null],
            popular: [null],
            publicImageUrl: [null],
            orderPosition: null,
        });
    }

    ngOnInit() {
        if(window.innerWidth<769)this.toggleDrawer();
        let id = this.route.url.split(['/'][0]);
        this.categoryId = Number(id[3]);
        if (this.categoryId) this.loadProductCategory();
    }

    loadProductCategory() {
        this.productCategoryService.get(this.categoryId).subscribe((data) => {
            this.ngZone.run(() => {
                this.selectedProductCategory = data;
                this.userForm.patchValue({
                    name: this.selectedProductCategory.name,
                    description: this.selectedProductCategory.description,
                    parentProductCategory: data.parentProductCategory,
                    imageUrl: data.imageUrl,
                    publicImageUrl: data.publicImageUrl,
                    orderPosition: data.orderPosition,
                    popular: data.popular,
                });
            });
        });
    }

    toggleDrawer() {
        this.categoryComponent.matDrawer.toggle();
    }

    onSubmit() {
        this.formSubmitted = true;
        if(this.userForm.invalid) return;
        this.isLoading.next(true);
        if (!this.categoryId) this.userForm.value.id = 0;
        this.productCategoryService.save(this.userForm.value, this.categoryId).subscribe(data => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: this.categoryId ? 'Your category has been updated.' : 'Your details have been saved.',
            });
            this.categoryId ? this.loadProductCategory() : this.route.navigate(['/admin/productcategories', data.body.id]);
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    openModal(modal) {
        this.dialog.open(modal, { width: '500px' });
    }

    closeModal() {
        this.dialog.closeAll();
    }

    liveProductCategory() {
        this.isLoading.next(true);
        this.closeModal();
        this.productCategoryService.approveProductCategory(this.selectedProductCategory.id).subscribe((data) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your category has been updated.',
            });
            this.loadProductCategory();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    hideProductCategory() {
        this.isLoading.next(true);
        this.closeModal();
        this.productCategoryService.disableProductCategory(this.selectedProductCategory.id).subscribe((data) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your category has been updated.',
            });
            this.loadProductCategory();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    archive(id) {
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
                this.closeModal();
                this.productCategoryService.archive(this.selectedProductCategory.id).subscribe(data => {
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Removed successfuly.',
                    });
                    this.isLoading.next(false);
                    this.location.back();
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
