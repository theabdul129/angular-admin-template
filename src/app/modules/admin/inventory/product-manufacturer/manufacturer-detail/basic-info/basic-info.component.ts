import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductManufacturerService } from '../../product-manufacturer.service';
import { ProductManufacturerDetailComponent } from '../manufacturer-detail.component';

@Component({
    selector: 'product-manufacturerInfo',
    templateUrl: './basic-info.component.html'
})
export class ManufacturerBasicInfoComponent implements OnInit {

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    userForm: UntypedFormGroup;
    manufacturerId: any;
    manufacturerData: any;
    contentType = 'product';
    formSubmitted: boolean = false;

    constructor(
        private manufacturerComponent: ProductManufacturerDetailComponent,
        private formBuilder: UntypedFormBuilder,
        private manufacturerService: ProductManufacturerService,
        private router: Router,
    ) {
        this.userForm = this.formBuilder.group({
            name: [null, Validators.compose([Validators.required])],
            manufacturer: [null, Validators.compose([Validators.required])],
            manufacturerContact: [],
            website: [],
            logoImageUrl: []
        });
    }

    ngOnInit() {
        let id = this.router.url.split(['/'][0]);
        this.manufacturerId = Number(id[3]);
        if (this.manufacturerId) this.loadData();
    }

    loadData() {
        this.isLoading.next(true);
        this.manufacturerService.get(this.manufacturerId).subscribe(data => {
            this.isLoading.next(false);
            this.manufacturerData = data;
            this.userForm.patchValue({
                name: this.manufacturerData.name,
                manufacturer: this.manufacturerData.manufacturer,
                manufacturerContact: this.manufacturerData.manufacturerContact,
                website: this.manufacturerData.website
            })
        }, error => this.isLoading.next(false))
    }

    toggleDrawer() {
        this.manufacturerComponent.matDrawer.toggle();
    }

    onSubmit() {
        this.manufacturerData ? this.update() : this.create();
    }

    create() {
        this.formSubmitted = true;
        if(this.userForm.invalid) return;
        this.isLoading.next(true);
        this.userForm.value.id = 0;
        this.manufacturerService.create(this.userForm.value).subscribe(data => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your manufacturer details have been saved.',
            });
            this.router.navigate(['/admin/productmanufacturers/', data.body.id]);
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
        this.userForm.value.id = this.manufacturerId;
        this.isLoading.next(true);
        this.manufacturerService.update(this.manufacturerId, this.userForm.value).subscribe(data => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your manufacturer has been updated.',
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

    onUpload(fileName) {
        console.log('fileName', fileName)
    }
}