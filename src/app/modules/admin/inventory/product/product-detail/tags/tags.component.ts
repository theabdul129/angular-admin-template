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
    selector: 'product-tags',
    templateUrl: './tags.component.html'
})
export class TagsComponent implements OnInit {

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    selectedProduct: Product;
    productId: any;
    form: UntypedFormGroup;
    dataSource: any;
    errorMsg: any;
    displayedColumns: string[] = ['sr', 'gtin', 'type', 'action'];
    formSubmitted: boolean = false;

    constructor(
        public dialog: MatDialog,
        private productComponent: ProductDetailComponent,
        private inventory: InventoryService,
        private route: Router,
        private formBuilder: UntypedFormBuilder,
        private location: Location,
        private ngZone: NgZone
    ) {
        this.form = this.formBuilder.group({
            name: [null, Validators.compose([Validators.required])],
            publicImageUrl: ['']
        });
    }

    ngOnInit() {
        let storeId = this.route.url.split(['/'][0]);
        this.productId = Number(storeId[4]);
        if (this.productId) this.loadData();
        else this.location.back();
    }

    loadData() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.inventory.get(this.productId).subscribe(data => {
            this.ngZone.run(() => {
                this.isLoading.next(false);
                this.selectedProduct = data;
                this.dataSource.data = this.selectedProduct.productTags;
            })
        }, error => this.isLoading.next(false));
    }

    toggleDrawer() {
        this.productComponent.matDrawer.toggle();
    }

    onSubmit() {
        this.formSubmitted = true;
        if (this.form.invalid) return;
        this.isLoading.next(true);
        this.form.value.id = 0;
        this.inventory.addProductTag(this.form.value, this.selectedProduct.id)
            .subscribe(data => {
                this.closeModal();
                this.formSubmitted = false;
                if (data.status != 200) return;
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'Your Tag details have been saved.',
                });
                this.loadData();
                this.form.reset();
            }, error => {
                this.closeModal();
                this.isLoading.next(false);
                SWALMIXIN.fire({
                    icon: 'error',
                    title: error.error.errorMessage,
                });
            });
    }

    onRemove(id) {
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
                this.inventory.removeProductTag(id, this.selectedProduct.id)
                    .subscribe(data => {
                        if (data.status != 200) return;
                        this.isLoading.next(false);
                        SWALMIXIN.fire({
                            icon: 'success',
                            title: 'Removed successfuly.',
                        });
                        this.loadData();
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
        this.dialog.open(modal, { width: '360px' });
    }

    closeModal() {
        this.dialog.closeAll();
    }

    onFile(file) {
        this.form.value.publicImageUrl = file;
    }
}