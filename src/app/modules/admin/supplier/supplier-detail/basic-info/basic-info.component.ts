import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { Location } from '@angular/common';
import { CatchmentArea } from 'app/models/catchmentarea';
import { SupplierDetailComponent } from '../supplier-detail.component';
import { SuppliersService } from '../../supplier.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
    selector: 'basic-supplierDetail',
    templateUrl: './basic-info.component.html'
})
export class SupplierBasicDetailComponent implements OnInit {

    supplierID: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    form: UntypedFormGroup;
    selectedCatchmentArea: CatchmentArea;
    formSubmitted: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: Router,
        public dialog: MatDialog,
        private supplierComponent: SupplierDetailComponent,
        private location: Location,
        private supplierService: SuppliersService,
    ) {
        this.form = this.formBuilder.group({
            accountNumber: ['', Validators.compose([Validators.required])],
            address: [null, Validators.compose([Validators.required])],
            name: ['', Validators.compose([Validators.required])],
            emailAddress: ['', [Validators.required, Validators.email,

            ]],
            website: [''],
            accountWebsite: ['']
        });
    }

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.supplierID = Number(id[3]);
        if (this.supplierID) this.loadSupplier();
    }

    loadSupplier() {
        this.isLoading.next(true);
        this.supplierService.get(this.supplierID).subscribe(data => {
            this.form.patchValue({
                accountNumber: data.accountNumber,
                address: data.address,
                name: data.name,
                emailAddress: data.emailAddress,
                website: data.website,
                accountWebsite: data.accountWebsite,
            });
            this.isLoading.next(false);
        });
    }

    onSubmit() {
        if (this.supplierID) this.updateSupplier();
        else this.createSupplier();
    }

    createSupplier() {
        this.formSubmitted = true;
        if(this.form.invalid) return;
        this.isLoading.next(true);
        this.form.value.id = 0;
        this.supplierService.create(this.form.value).subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your supplier details have been saved.',
            });
            this.route.navigate(['/admin/suppliers/', data.body.id]);
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    updateSupplier() {
        this.formSubmitted = true;
        if(this.form.invalid) return;
        this.isLoading.next(true);
        this.supplierService.update(this.supplierID, this.form.value).subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your supplier has been updated.',
            });
            this.loadSupplier();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    toggleDrawer() {
        this.supplierComponent.matDrawer.toggle();
    }
}