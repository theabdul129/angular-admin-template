import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductCategoryDetailComponent } from '../category-detail.component';
import { ProductCategoryService } from '../../category.service';
import { ProductCategory } from 'app/models/productcategory';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
    selector: 'related-category',
    templateUrl: './related-category.component.html'
})
export class ProductRelatedCategoryComponent implements OnInit {

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    categoryId: any;
    selectedChildProductCategory: ProductCategory;
    childProductCategories: [ProductCategory];
    pageSize: number = 10;
    pageNumber: number = 0;
    dataSource: any;
    totalAccounts: any;
    errorMsg: any;
    displayedColumns: string[] = ['id', 'name', 'action'];
    relatedCategoryForm: UntypedFormGroup;
    selectedProductCategory: ProductCategory;

    constructor(
        private route: Router,
        public dialog: MatDialog,
        private categoryComponent: ProductCategoryDetailComponent,
        private productCategoryService: ProductCategoryService,
        private formBuilder: UntypedFormBuilder,
        private ngZone: NgZone,
        private location: Location
    ) {
        this.relatedCategoryForm = this.formBuilder.group({
            relatedProductCategory: [null, Validators.compose([Validators.required])],
        });
    }

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    ngOnInit() {
        if(window.innerWidth<769)this.toggleDrawer();
        let id = this.route.url.split(['/'][0]);
        this.categoryId = Number(id[3]);
        if(this.categoryId) this.loadProductCategory();
        else this.location.back();
    }

    toggleDrawer() {
        this.categoryComponent.matDrawer.toggle();
    }

    openProductCategory(modal, selectedChildProductCategory) {
        this.selectedChildProductCategory = selectedChildProductCategory;
        this.dialog.open(modal, { width: '500px' });
    }

    closeModal() {
        this.dialog.closeAll();
    }

    paginate(event: PageEvent) {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadProductCategory();
    }

    onAddRelatedCategory() {
        if (this.relatedCategoryForm.invalid) return;
        const payload = this.relatedCategoryForm.controls.relatedProductCategory.value;
        this.productCategoryService.addRelatedProductCategory(payload, this.selectedProductCategory.id).subscribe(data => {
            this.ngZone.run(() => {
                if(data.status != 200) return;
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'Your category details have been saved.',
                });
                this.loadProductCategory();
            })
        }, error => {
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    loadProductCategory() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.productCategoryService
            .get(this.categoryId)
            .subscribe(data => {
                this.ngZone.run(() => {
                    this.isLoading.next(false);
                    this.selectedProductCategory = data;
                    this.dataSource.data = data.relatedCategories;
                    this.dataSource.paginator = this.paginator;
                    this.totalAccounts = data.relatedCategories.length;
                })

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
                this.productCategoryService.removeRelatedProductCategory(productCategory.id, this.selectedProductCategory.id).subscribe(data => {
                    this.ngZone.run(() => {
                        if(data.status != 200) return;
                        SWALMIXIN.fire({
                            icon: 'success',
                            title: 'Removed successfuly.',
                        });
                        this.loadProductCategory();
                    })
                }, error => {
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                });
            }
        });
    }

}