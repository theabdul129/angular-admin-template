import { Component, OnInit } from '@angular/core';
import { AccountDetailComponent } from '../account-detail.component';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { BusinessAccountService } from '../../business-account.service';
import { SWALMIXIN } from 'app/core/services/mixin.service';
@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html'

})
export class BankDetailsComponent implements OnInit {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
  datemask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];
  currencyList = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'SGD', 'CHF', 'MYR', 'JPY', 'CNY'];
  formGroupBankAccountDetails: UntypedFormGroup;
  bankAccount;
  
  hideAccountName = false;
  hideAccountNumber= false;
  hideBankName=false;
  hideSortCode=false;
  hideIban=false;
  hideCurrency=false;

  constructor(  private accountComponent: AccountDetailComponent,  private businessService: BusinessAccountService,private formBuilder: UntypedFormBuilder,) { }

  ngOnInit(): void {
    if(window.innerWidth<769)this.toggleDrawer();
    this.formGroupBankAccountDetails = this.formBuilder.group({
      bankName: [''],
      accountNumber: ['', [Validators.required]],
      accountName: ['', Validators.required],
      sortCode: ['',Validators.required],
      iban: ['',Validators.required],
      currency:['',Validators.required],
    });
    
  this.getAccountDetails()
  
  }

  toggleDrawer() {
    this.accountComponent.matDrawer.toggle();
}


onSubmit(){
  this.isLoading.next(true);
  let value = this.formGroupBankAccountDetails.value;
  value.sortCode = value.sortCode.replace(/\-/g,"")
  this.businessService.saveBusinessBankAccount(value).subscribe((data) => {
     
      this.formGroupBankAccountDetails.patchValue(data);
  this.bankAccount = data;
  SWALMIXIN.fire({
    icon: 'success',
    title: 'Your Bank Account details has been updated.',
  });
      this.isLoading.next(false);
  }, (error) => {
    this.isLoading.next(false);
    SWALMIXIN.fire({
      icon: 'error',
      title: error.error.errorMessage,
    });
  });

}

getAccountDetails() {
  this.isLoading.next(true);
  this.businessService.getBusinessBankAccount().subscribe((data) => {
    this.isLoading.next(false);
    this.hideAccountName = true;
    this.hideAccountNumber= true;
    this.hideBankName=true;
    this.hideSortCode=true;
    this.hideIban=true;
    this.hideCurrency=true;
      this.formGroupBankAccountDetails.patchValue(data);
      this.bankAccount = data;
  },(err)=>{
    this.isLoading.next(false);
  });
}
}
