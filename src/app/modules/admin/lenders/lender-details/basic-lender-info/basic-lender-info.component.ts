import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { TenantLender } from 'app/models/tenantlender';
import { BehaviorSubject, Observable } from 'rxjs';
import { LenderService } from '../../lender.service';

@Component({
  selector: 'basic-lender-info',
  templateUrl: './basic-lender-info.component.html',
})
export class BasicLenderInfoComponent implements OnInit {

  heading = 'Lenders';
  icon = 'pe-7s-display1 icon-gradient bg-premium-dark';
  lenderForm: UntypedFormGroup;
  gtinForm: UntypedFormGroup;
  tagForm: UntypedFormGroup;
  relatedCategoryForm: UntypedFormGroup;
  mergeProductForm: UntypedFormGroup;
  invalidForm = false;

  filterArgs = { archived: null };
  //s3ImageHttpUrl = environment.s3ImageHttpUrl;

  showOverlay = false;
  lenderId: any;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
  errorMsg: any;
  formSubmitted: boolean = false;
  lenders: any;
  description: any;

  currencyList = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'SGD', 'CHF', 'MYR', 'JPY', 'CNY'];
  selectedlender;
  paginator: any;
  pageNumber: any;
  pageSize: any;

  constructor(
      private formBuilder: UntypedFormBuilder,
      private router: Router,
      private activeRoute: ActivatedRoute,
      public dialog: MatDialog,
      private systemlender: LenderService,
  ) {
      this.lenderForm = this.formBuilder.group({
          lender: [null, Validators.compose([Validators.required])],
          code: null,
          secret: null
      });
  }

  ngOnInit() {
      let id = this.router.url.split(['/'][0]);
      this.selectedlender = Number(id[4]);
      if (this.selectedlender) {this.loadLender(this.selectedlender);}
      this.systemLender();
  }

  loadLender(id) {
      this.isLoading.next(true);
      this.systemlender.getLender(id).subscribe((data: any) => {
          this.isLoading.next(false);
          this.lenderForm.patchValue({
              id: data.id,
              code: data.code,
              lender: data.lender.id
          });
      });
  }

  systemLender() {
      this.isLoading.next(true);
      this.systemlender.getsystemLenders(0, 500).subscribe((data: any) => {
          this.isLoading.next(false);
          this.lenders = data.data;
      });
  }

  onSubmit() {
      this.formSubmitted = true;
      if (this.lenderForm.invalid) return;
       this.update();
  }
  update() {
    this.isLoading.next(true);
    const id = this.selectedlender;
    const registerPayload: TenantLender = {
        id,
        code: this.lenderForm.controls.code.value,
        lender: { id: this.lenderForm.controls.lender.value }
    };
    this.systemlender.save(registerPayload, id).subscribe(
        (data) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your Lender details have been saved.',
            });
            this.router.navigateByUrl('/admin/lenders');
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

  closeModal() {
      this.dialog.closeAll();
  }

  openModal(modal) {
      this.dialog.open(modal, { width: '600px' });
  }

}
