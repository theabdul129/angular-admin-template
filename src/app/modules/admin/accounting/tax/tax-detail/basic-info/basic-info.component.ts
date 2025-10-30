import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { Location } from '@angular/common';
import { CatchmentArea } from 'app/models/catchmentarea';
import { TaxDetailComponent } from '../tax-detail.component';
import { TaxService } from '../../tax.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'basic-taxDetail',
    templateUrl: './basic-info.component.html'
})
export class TaxBasicDetailComponent implements OnInit {

    taxID: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    form: UntypedFormGroup;
    selectedCatchmentArea: CatchmentArea;
    formSubmitted: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: Router,
        public dialog: MatDialog,
        private taxComponent: TaxDetailComponent,
        private location: Location,
        private taxService: TaxService,
    ) {
        this.form = this.formBuilder.group({
            country: [],
            inclusive: [],
            rate: ['', Validators.required],
            type: ['', Validators.required],
            typeOther: [''],
            description: [''],
        });
    }

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.taxID = Number(id[4]);
        if (this.taxID) this.loadTax();
    }

    loadTax() {
        this.isLoading.next(true);
        this.taxService.get(this.taxID).subscribe(data => {
            this.isLoading.next(false);
            this.form.patchValue({
                country: data.country,
                inclusive: data.inclusive,
                rate: data.rate,
                type: data.type,
                typeOther: data.typeOther,
                description: data.description,
            });
        });
    }

    onSubmit() {
        if (this.taxID) this.updateTax();
        else this.createTax();
    }

    createTax() {
        this.formSubmitted = true;
        if(this.form.invalid) return;
        this.isLoading.next(true);
        this.form.value.id = 0;
        this.form.value.rate = Number(this.form.value.rate);
        this.taxService.create(this.form.value).subscribe((data: any) => {
            this.isLoading.next(false);
            if(data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your tax details have been saved.',
            });
            this.route.navigate(['/admin/accounting/tax/', data.body.id]);
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    updateTax() {
        this.formSubmitted = true;
        if(this.form.invalid) return;
        this.isLoading.next(true);
        this.taxService.update(this.taxID, this.form.value).subscribe((data: any) => {
            this.isLoading.next(false);
            if(data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your tax has been updated.',
            });
            this.loadTax();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    toggleDrawer() {
        this.taxComponent.matDrawer.toggle();
    }
}