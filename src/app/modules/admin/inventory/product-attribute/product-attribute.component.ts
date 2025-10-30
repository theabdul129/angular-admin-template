import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ProductAttributeService } from './product-attribute.service';

@Component({
    selector: 'product-attributes',
    templateUrl: './product-attribute.component.html',
})

export class ProductAttributeComponent implements OnInit {
    title = 'Product Attributes | bsktpay';
    pageSize: number = 10;
    pageNumber: number = 0;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    productId: any;
    errorMsg: any;
    displayedColumns: string[] = ['sr', 'name', 'type', 'desc', 'action'];
    dataSource: any;
    totalAccounts: any;
    selectedAttribute: any;
    form: UntypedFormGroup;
    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private attributeService: ProductAttributeService,
        public dialog: MatDialog,
        private formBuilder: UntypedFormBuilder,
        private titleService: Title
    ) {
        this.form = this.formBuilder.group({
            id: [null],
            name: [null, Validators.compose([Validators.required])],
            description: [null, Validators.compose([Validators.required])],
            type: [null, Validators.compose([Validators.required])],
        });
    }

    ngOnInit() {
        this.loadData();
        this.titleService.setTitle(this.title);
    }

    loadData() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.attributeService.productAttributes(this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize)
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

    closeModal() {
        this.dialog.closeAll();
    }

    openPackage(modal, dimension) {
        this.form.reset();
        this.selectedAttribute = dimension;
        this.dialog.open(modal, { width: '650px' });
        if (this.selectedAttribute) {
            this.form.patchValue({
                name: this.selectedAttribute.name,
                description: this.selectedAttribute.description,
                type: this.selectedAttribute.type
            })
        }
    }

    onArchive(id) {
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
                this.attributeService
                    .archiveProductAttribute(id)
                    .subscribe(data => {
                        if (data.status != 200) return;
                        SWALMIXIN.fire({
                            icon: 'success',
                            title: 'Archived successfuly.',
                        });
                        this.loadData();
                    }, error => {
                        SWALMIXIN.fire({
                            icon: 'error',
                            title: error.error.errorMessage,
                        });
                    });
            }
        });
    }

    onSubmit() {
        this.selectedAttribute ? this.updateData() : this.saveData();
    }

    saveData() {
      //  this.form.value.id = 0;
        this.isLoading.next(true);
        this.attributeService
            .createProductAttribute(this.form.value)
            .subscribe(data => {
                this.isLoading.next(false);
                if (data.status != 200) return;
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'Your attribute details have been saved.',
                });
                this.dialog.closeAll();
                this.loadData();
            }, error => {
                this.isLoading.next(false);
                SWALMIXIN.fire({
                    icon: 'error',
                    title: error.error.errorMessage,
                });
            });
    }

    updateData() {
        this.isLoading.next(true);
        this.attributeService
            .updateProductAttribute(this.form.value, this.selectedAttribute.id)
            .subscribe(data => {
                this.isLoading.next(false);
                if (data.status != 200) return;
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'Your attribute details have been saved.',
                });
                this.dialog.closeAll();
                this.loadData();
            }, error => {
                this.isLoading.next(false);
                SWALMIXIN.fire({
                    icon: 'error',
                    title: error.error.errorMessage,
                });
            });
    }
}