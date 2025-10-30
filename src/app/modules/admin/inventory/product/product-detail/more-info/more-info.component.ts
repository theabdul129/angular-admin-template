import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailComponent } from '../product-detail.component';
import { InventoryService } from '../../../inventory.service';
import { Product } from 'app/models/product';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { ProductTypeService } from '../../../product-type/product-type.service';

@Component({
    selector: 'basic-moreinfo',
    templateUrl: './more-info.component.html',
})
export class ProductMoreInfoComponent implements OnInit {
    userForm: UntypedFormGroup;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    panelOpenState = false;
    productId: any;
    selectedProduct: Product;
    mergeProductForm: UntypedFormGroup;
    attributes: any;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: Router,
        private inventory: InventoryService,
        public dialog: MatDialog,
        private productComponent: ProductDetailComponent,
        private location: Location,
        private productTypeService: ProductTypeService
    ) {
        this.userForm = this.formBuilder.group({
            attributes: this.formBuilder.array([]),
        });
    }

    ngOnInit() {
        if(window.innerWidth<769) this.toggleDrawer();
        let id = this.route.url.split(['/'][0]);
        this.productId = Number(id[4]);
        if (this.productId) this.loadProduct();
        else this.location.back();
    }

    getAttributes(id, attributeValues) {


        this.isLoading.next(true);
        this.productTypeService.getProductType(id).subscribe((data: any) => {
            this.isLoading.next(false);
            this.attributes = data.attributes;
            for (let index = 0; index < this.attributes.length; index++) {
                var value =  attributeValues?.hasOwnProperty(this.attributes[index].name) ?  attributeValues[this.attributes[index].name] : null;
               

                const control = new UntypedFormGroup({
                    value: new UntypedFormControl(value),
                    attribute: new UntypedFormControl(this.attributes[index]),
                    id: new UntypedFormControl(null),
                });
                (<UntypedFormArray>this.userForm.get('attributes')).push(control);
            }
        });
    }

    loadProduct() {
        this.isLoading.next(true);
        this.inventory.get(this.productId).subscribe((data) => {
            this.isLoading.next(false);
            this.selectedProduct = data;
            this.getAttributes(
                this.selectedProduct.productType.id,
                data.attributes
            );
        });
    }

    toggleDrawer() {
        this.productComponent.matDrawer.toggle();
    }

    onSubmit() {
        this.isLoading.next(true);
        this.inventory
            .saveAttributes(this.userForm.value.attributes, this.productId)
            .subscribe(
                (data) => {
                    this.isLoading.next(false);
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Your product details have been saved.',
                    });
                    this.loadProduct();
                },
                (error) => {
                    this.isLoading.next(false);
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                }
            );
    }
}
