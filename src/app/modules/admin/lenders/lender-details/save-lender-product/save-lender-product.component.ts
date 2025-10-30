import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { LenderProduct } from 'app/models/lenderproduct';
import { BehaviorSubject, Observable } from 'rxjs';
import { LenderService } from '../../../lender.service';


@Component({
  selector: 'app-save-lender-product',
  templateUrl: './save-lender-product.component.html',
})
export class SaveLenderProductComponent implements OnInit {
  lenderproductForm: FormGroup;
  insterestRateTypesList = ['APR', 'FlatRate'];
  lenderId;
  formSubmitted: boolean;
  selectedlender;

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog,
    private lenderProduct: LenderService,
  ) {
    this.lenderproductForm = this.formBuilder.group({
      productName: [null, Validators.compose([Validators.required])],
      interestRateType: null,
      maxTermPeriod: [null, Validators.compose([Validators.required])],
      interestRate:[null, Validators.compose([Validators.required])],
  });
  }

  ngOnInit(): void {
    this.onSubmit();
  }
  onSubmit() {
    this.formSubmitted = true;
    if (this.lenderproductForm.invalid) return;
    // if (this.selectedlender) this.update();
    else this.save();
}
  save() {
    this.isLoading.next(true);
    const registerPayload: LenderProduct = {
        interestRate:this.lenderproductForm.controls.interestRate.value,
        maxTermPeriod:this.lenderproductForm.controls.maxTermPeriod.value,
        productName:this.lenderproductForm.controls.productName.value,
        interestRateType:this.lenderproductForm.controls.interestRateType.value
    };
    this.lenderProduct.savelenderProduct(registerPayload, this.lenderId,null).subscribe(
        (data) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your product details have been saved.',
            });
            this.router.navigate(['/admin/lenders/', data.body.id]);
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
