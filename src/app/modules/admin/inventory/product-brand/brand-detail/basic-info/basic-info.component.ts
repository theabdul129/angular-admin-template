import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ProductManufacturerService } from '../../../product-manufacturer/product-manufacturer.service';
import { ProductBrandService } from '../../product-brand.service';
import { ProductBrandDetailComponent } from '../brand-detail.component';

@Component({
    selector: 'product-brandInfo',
    templateUrl: './basic-info.component.html'
})
export class BrandBasicInfoComponent implements OnInit {

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    userForm: UntypedFormGroup;
    brandId: any;
    brandData: any;
    manufacturers: any;
    formSubmitted: boolean = false;

    constructor(
        private brandComponent: ProductBrandDetailComponent,
        private formBuilder: UntypedFormBuilder,
        private brandService: ProductBrandService,
        private router: Router,
        private manufacturerService: ProductManufacturerService
    ) {
        this.userForm = this.formBuilder.group({
            name: [null, Validators.compose([Validators.required])],
            productManufacturer: []
        });
    }

    ngOnInit() {
        let id = this.router.url.split(['/'][0]);
        this.brandId = Number(id[3]);
        this.getManufacturers();
    }

    getManufacturers() {
        this.isLoading.next(true);
        this.manufacturerService.getAll(0, 500)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                    if (this.brandId) this.loadData();
                })
            ).subscribe(data => this.manufacturers = data.data);
    }

    loadData() {
        this.isLoading.next(true);
        this.brandService.get(this.brandId).subscribe(data => {
            this.isLoading.next(false);
            this.brandData = data;
            this.userForm.patchValue({
                name: this.brandData.name,
                productManufacturer: this.brandData.productManufacturer.id
            })
        }, error => this.isLoading.next(false))
    }

    toggleDrawer() {
        this.brandComponent.matDrawer.toggle();
    }

    onSubmit() {
        this.brandData ? this.update() : this.create();
    }

    create() {
        this.formSubmitted = true;
        if(this.userForm.invalid) return;
        this.isLoading.next(true);
        this.userForm.value.id = 0;
        this.userForm.value.productManufacturer = { id: this.userForm.value.productManufacturer };
        this.brandService.create(this.userForm.value).subscribe(data => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your brand details have been saved.',
            });
            this.router.navigate(['/admin/productbrands/', data.body.id]);
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        })
    }

    update() {
        this.formSubmitted = true;
        if(this.userForm.invalid) return;
        this.userForm.value.id = this.brandId;
        this.userForm.value.productManufacturer = { id: this.userForm.value.productManufacturer };
        this.isLoading.next(true);
        this.brandService.update(this.brandId, this.userForm.value).subscribe(data => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your brand has been updated.',
            });
            this.loadData();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        })
    }
}