import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductCategoryDetailComponent } from '../category-detail.component';
import { ProductCategoryService } from '../../category.service';
import { ProductCategory } from 'app/models/productcategory';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
    selector: 'product-category',
    templateUrl: './product-category.component.html'
})
export class ProductCategoryComponent implements OnInit {

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

    constructor(
        private route: Router,
        public dialog: MatDialog,
        private categoryComponent: ProductCategoryDetailComponent,
        private productCategoryService: ProductCategoryService,
        private location: Location,
        private cdr:ChangeDetectorRef
    ) { }

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    ngOnInit() {
        if(window.innerWidth<769)this.toggleDrawer();
        let id = this.route.url.split(['/'][0]);
        this.categoryId = Number(id[3]);
        if (this.categoryId) this.loadChildProductCategory();
        else this.location.back();
    }

    toggleDrawer() {
        this.categoryComponent.matDrawer.toggle();
    }

    openProductCategory(modal, selectedChildProductCategory) {
        this.selectedChildProductCategory = selectedChildProductCategory;
        this.dialog.open(modal, { width: '500px' });
    }

    loadChildProductCategory() {
        this.dataSource = new MatTableDataSource();
        this.productCategoryService
            .childProductCategories(this.categoryId, this.pageNumber, this.pageSize)
            .subscribe(data => {
                this.childProductCategories = data.data;
                this.dataSource.data = data.data;
                this.dataSource.paginator = this.paginator;
                this.totalAccounts = data.totalSize;
                this.cdr.detectChanges();
            });
    }

    closeModal() {
        this.dialog.closeAll();
    }

    paginate(event: PageEvent) {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadChildProductCategory();
    }

}