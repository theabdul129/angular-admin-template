import { Component, OnInit } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { ProductTypeService } from "../../product-type.service";
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { ProductTypeDetailComponent } from "../details.component";

@Component({
    selector: 'basic-productDetail',
    templateUrl: './basic-info.component.html'
})
export class ProductTypeBasicDetailComponent implements OnInit {

    form: UntypedFormGroup;
    productId;
    isEdit: boolean;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    private productComponent: ProductTypeDetailComponent
    constructor(
        private productTypeService: ProductTypeService,
        private formBuilder: UntypedFormBuilder,
        private route: Router
    ) {
        this.form = this.formBuilder.group({
            id: [null],
            name: [null, Validators.compose([Validators.required])],
            description: [],
        });
    }

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.productId = Number(id[4]);
        if(this.productId) this.loadData();
    }

    loadData() {
        this.productTypeService.getProductType(this.productId).subscribe(data=> {
            this.form.patchValue({
                name: data.name,
                description: data.description
            })
        })
    }

    toggleDrawer() {
        this.productComponent.matDrawer.toggle();
    }

    onSubmit() {
        this.productId ? this.updateData() : this.saveData();
    }

    saveData() {
        this.form.value.id = 0;
        this.isLoading.next(true);
        this.productTypeService
            .createProductTypes(this.form.value)
            .subscribe(data => {
                this.isLoading.next(false);
                if (data.status != 200) return;
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'Your product type details have been saved.',
                });
                this.route.navigate(['/admin/product-types/edit/', data.body.id]);
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
        this.productTypeService
            .updateProductTypes(this.form.value, this.productId)
            .subscribe(data => {
                this.isLoading.next(false);
                if (data.status != 200) return;
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'Your product type details have been saved.',
                });
                this.route.navigate(['/admin/product-types/edit/', data.body.id]);
            }, error => {
                this.isLoading.next(false);
                SWALMIXIN.fire({
                    icon: 'error',
                    title: error.error.errorMessage,
                });
            });
    }
}