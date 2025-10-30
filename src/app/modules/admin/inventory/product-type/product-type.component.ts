import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductTypeService } from './product-type.service';

@Component({
    selector: 'product-types',
    templateUrl: './product-type.component.html',
})

export class ProductTypesComponent implements OnInit {
    title = 'Product Types | bsktpay';
    pageSize: number = 10;
    pageNumber: number = 0;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    productId: any;
    errorMsg: any;
    displayedColumns: string[] = ['sr', 'name', 'desc', 'action'];
    dataSource: any;
    totalAccounts: any;
    selectedType: any;
    form: UntypedFormGroup;
    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private productTypeService: ProductTypeService,
        public dialog: MatDialog,
        private formBuilder: UntypedFormBuilder,
        private titleService: Title
    ) {
        this.form = this.formBuilder.group({
            id: [null],
            name: [null, Validators.compose([Validators.required])],
            description: [],
            attributes: [],
        });
    }

    ngOnInit() {
        this.loadData();
        this.titleService.setTitle(this.title);
    }

    loadData() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.productTypeService.productTypes(this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize)
            .subscribe((data: any) => {
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
    
}