import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { LenderProduct } from 'app/models/lenderproduct';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { LenderService } from '../../lender.service';

@Component({
    selector: 'app-lender-product',
    templateUrl: './lender-product.component.html',
})
export class LenderProductComponent implements OnInit {
    max = 1000;
    min = 0;
    value = 0;

    heading = 'Lenders';
    icon = 'pe-7s-display1 icon-gradient bg-premium-dark';
    lenderproductForm: UntypedFormGroup;
    invalidForm = false;

    filterArgs = { archived: null };
    //s3ImageHttpUrl = environment.s3ImageHttpUrl;
    selectedLenderProduct;
    showOverlay = false;
    lenderId;
    productId;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    errorMsg: any;
    formSubmitted: boolean = false;
    lenders: any;
    description: any;
    dataSource: any;
    totalAccounts: any;

    insterestRateTypesList = ['APR', 'FlatRate'];
    paginator: any;
    pageNumber: any;
    pageSize: any;
    lenderData: any;

    displayedColumns: string[] = [
        'id',
        'name',
        'interestRate',
        'maxTermPeriod',
        'action',
    ];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private router: Router,
        private activeRoute: ActivatedRoute,
        public dialog: MatDialog,
        private lenderProduct: LenderService
    ) {
        this.lenderproductForm = this.formBuilder.group({
            customerScoreMax:null,
            customerScoreMin:null,
            productName: [null, Validators.compose([Validators.required])],
            interestRateType: null,
            lenderCode: null,
            maxTermPeriod: [null, Validators.compose([Validators.required])],
            interestRate: [null, Validators.compose([Validators.required])],
        });
    }

    ngOnInit() {
        let id = this.router.url.split(['/'][0]);
        this.lenderId = Number(id[4]);
        this.getLender();
        if (this.lenderId) this.loadLenderProduct();
    }
    formatLabel(value: number) {
        console.log(value);
        if (value >= 10001) {
          return Math.round(value / 1000);
        }
        return value;
      }
    getLender() {
        this.lenderProduct
            .getLender(this.lenderId)
            .subscribe((data) => (this.lenderData = data));
    }
    paginate(event: PageEvent) {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadLenderProduct();
    }
    loadLenderProduct() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.lenderProduct
            .getLenderProduct(
                this.lenderId,
            )
            .subscribe(
                (data: any) => {
                    this.dataSource.data = data.data;
                    this.dataSource.paginator = this.paginator;
                    this.totalAccounts = data.totalSize;
                    this.isLoading.next(false);
                },
                (error) => {
                    this.isLoading.next(false);
                    this.errorMsg = error.message;
                }
            );
    }

    onSubmit() {
        this.formSubmitted = true;
        if (this.lenderproductForm.invalid) return;
        console.log(this.productId,'sdfasdfasdfasdf')
        if (this.productId) this.update();
        else this.save();
    }

    save() {
        this.isLoading.next(true);
        const registerPayload: LenderProduct = {
            customerScoreMax:this.lenderproductForm.controls.customerScoreMax.value,
            customerScoreMin:this.lenderproductForm.controls.customerScoreMin.value,
            interestRate: this.lenderproductForm.controls.interestRate.value,
            maxTermPeriod: Number(
                this.lenderproductForm.controls.maxTermPeriod.value
            ),
            productName: this.lenderproductForm.controls.productName.value,
            lenderCode: this.lenderproductForm.controls.lenderCode.value,
            interestRateType:
                this.lenderproductForm.controls.interestRateType.value,
        };
        this.lenderProduct
            .savelenderProduct(registerPayload, this.lenderId,null)
            .subscribe(
                (data) => {
                    this.isLoading.next(false);
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Your product details have been saved.',
                    });
                    this.dialog.closeAll();
                    this.loadLenderProduct();
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

    update() {
        this.isLoading.next(true);
        const id = this.productId;
        const registerPayload: LenderProduct = {
            customerScoreMax:this.lenderproductForm.controls.customerScoreMax.value,
            customerScoreMin:this.lenderproductForm.controls.customerScoreMin.value,
            id: this.selectedLenderProduct && this.selectedLenderProduct.id,
            interestRate: this.lenderproductForm.controls.interestRate.value,
            maxTermPeriod: Number(
                this.lenderproductForm.controls.maxTermPeriod.value
            ),
            productName: this.lenderproductForm.controls.productName.value,
            lenderCode: this.lenderproductForm.controls.lenderCode.value,
            interestRateType:
                this.lenderproductForm.controls.interestRateType.value,
        };
        this.lenderProduct
            .savelenderProduct(registerPayload, this.lenderId,id)
            .subscribe(
                (data) => {
                    this.isLoading.next(false);
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Your Lender details have been Update.',
                    });
                    this.dialog.closeAll();
                    this.loadLenderProduct();
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
    delete(id) {
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
            this.lenderProduct.deleteLenderProduct(this.lenderId,id).subscribe(data => {
              if (data.status != 200) return;
              SWALMIXIN.fire({
                icon: 'success',
                title: 'Removed successfuly.',
              });
              this.loadLenderProduct();
            }, error => {
              SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
              });
            });
          }
        });
      }

    closeModal() {
        this.dialog.closeAll();
    }

    openModal(modal, data) {
        this.dialog.open(modal, { width: '600px' });
        this.lenderproductForm.reset();
        this.productId = null;
        if (data) {
            this.productId=data;
        this.isLoading.next(true);
        this.lenderProduct.getLenderProductId(this.lenderId,data).subscribe((data) => {
            this.isLoading.next(false);
            this.selectedLenderProduct = data;
                this.lenderproductForm.patchValue({
                    id: data.id,
                    customerScoreMax:data.customerScoreMax,
                    customerScoreMin:data.customerScoreMin,
                    maxTermPeriod: data.maxTermPeriod,
                    lenderCode: data.lenderCode,
                    interestRate: data.interestRate,
                    productName: data.productName,
                });
        });
    }
    }
}
