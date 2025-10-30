import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CatchmentAreaService } from '../../catchment.area.service';
import { CatchmentDetailComponent } from '../catchment-detail.component';

@Component({
    selector: 'catchment-deliveryCharge',
    templateUrl: './delivery-charge.component.html'
})
export class CatchmentDeliveryChargesComponent implements OnInit {

    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['currency', 'from', 'smOrder', 'smExOrder', 'smDel', 'cbCharge', 'cdCharge', 'mdCharge', 'mdmOrder', 'ldCharge', 'delIm', 'action'];
    dataSource: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    errorMsg: any;
    totalAccounts: any;
    catchmentId: any;
    form: UntypedFormGroup;
    selectedData: any;
    formSubmitted: boolean = false;
    currencyList = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'SGD', 'CHF', 'MYR', 'JPY', 'CNY'];
    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private route: Router,
        private location: Location,
        private dialog: MatDialog,
        private formBuilder: UntypedFormBuilder,
        private catchmentComponent: CatchmentDetailComponent,
        private catchmentAreaService: CatchmentAreaService,
    ) {
        this.form = this.formBuilder.group({
            smallCharge: ['',],
            mediumCharge: ['', ],
            largeCharge: ['', ],
            minOrderAmount: ['', Validators.compose([Validators.required] )],
            outOfCatchmentBaseCharge: [''],
            outOfCatchmentCharge: ['' ],
            smallOrderCharge: ['',],
            smallOrderAmount: ['',],
            mediumOrderAmount: [''],
            deliverImmediately: [],
            currency: ['', Validators.required]
        });
    }

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.catchmentId = Number(id[3]);
        if (this.catchmentId) this.getData();
        else this.location.back();
    }

    getData() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.catchmentAreaService.getDeliveryCharges(this.catchmentId, this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize)
            .subscribe((data: any) => {
                this.isLoading.next(false);
                this.dataSource.data = data.data;
                this.dataSource.paginator = this.paginator;
                this.totalAccounts = data.totalSize;
            }, error => {
                this.isLoading.next(false);
                this.errorMsg = error.message;
            })
    }

    paginate(event: PageEvent) {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getData();
    }

    toggleDrawer() {
        this.catchmentComponent.matDrawer.toggle();
    }

    openModal(modal, data) {
        this.selectedData = data;
        if (this.selectedData) {
            this.form.patchValue({
                smallCharge: this.selectedData.smallCharge / 100,
                mediumCharge: this.selectedData.mediumCharge / 100,
                largeCharge: this.selectedData.largeCharge / 100,
                minOrderAmount: this.selectedData.minOrderAmount / 100,
                outOfCatchmentBaseCharge: this.selectedData.outOfCatchmentBaseCharge / 100,
                outOfCatchmentCharge: this.selectedData.outOfCatchmentCharge / 100,

                smallOrderCharge: this.selectedData.smallOrderCharge / 100,
                smallOrderAmount: this.selectedData.smallOrderAmount / 100,
                mediumOrderAmount: this.selectedData.mediumOrderAmount / 100,
                deliverImmediately: this.selectedData.deliverImmediately,
                currency: this.selectedData.currency
            })
        } else this.form.reset();
        this.dialog.open(modal, { width: '650px' });
    }

    closeModal() {
        this.dialog.closeAll();
    }

    onSubmit() {
        this.saveData();
    }

    saveData() {
        this.formSubmitted = true;
        if(this.form.invalid) return;
        this.isLoading.next(true);
        this.form.value.id = this.selectedData ? this.selectedData.id : 0;
        this.form.value.smallCharge = this.form.value.smallCharge * 100;
        this.form.value.mediumCharge = this.form.value.mediumCharge * 100;
        this.form.value.largeCharge = this.form.value.largeCharge * 100;
        this.form.value.minOrderAmount = this.form.value.minOrderAmount * 100;
        this.form.value.outOfCatchmentBaseCharge = this.form.value.outOfCatchmentBaseCharge * 100;
        this.form.value.outOfCatchmentCharge = this.form.value.outOfCatchmentCharge * 100;
        this.form.value.smallOrderCharge = this.form.value.smallOrderCharge * 100;
        this.form.value.smallOrderAmount = this.form.value.smallOrderAmount * 100;
        this.form.value.mediumOrderAmount = this.form.value.mediumOrderAmount * 100;
        this.dialog.closeAll();
        this.catchmentAreaService.createDeliveryCharge(this.catchmentId, [this.form.value]).subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your delivery charges details have been saved.',
            });
            this.getData();
            this.formSubmitted = false;
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

}