import { Component, NgZone, OnInit,ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder, FormArray, UntypedFormGroup, Validators } from "@angular/forms";
import { BankAccount } from "app/models/bankAccount";
import { RegisterTenant } from "app/models/registerTenant";
import { BehaviorSubject, Observable } from "rxjs";
import { RegisterService } from "../registerService";
import { SWALMIXIN } from "app/core/services/mixin.service";
import { Router } from "@angular/router";
import { SearchCountryField, CountryISO, PhoneNumberFormat } from "ngx-intl-tel-input-gg";
import { AccountCollaborator } from "app/models/accountCollaborator";
import { User } from "app/models/user";
import { FuseAlertComponent, FuseAlertType } from "@fuse/components/alert";
import { passwordStrengthValidator } from './password-strength.validator';

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
  encapsulation  : ViewEncapsulation.None,
})
export class SignUpComponent implements OnInit {
  formGroup: UntypedFormGroup;
  showAlert = false;
  alert: { type: FuseAlertType; message: string } = {
    type: "success",
    message: "",
  };

  commonWords = ['password', '123456', 'admin', 'guest', 'user']; // Extend this list as needed

  searchCountryField = SearchCountryField;
  countryISO = CountryISO;
  phoneNumberFormat = PhoneNumberFormat;
  currencyList = ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "SGD", "CHF", "MYR", "JPY", "CNY"];
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  separateDialCode = false;
  constructor(private formBuilder: UntypedFormBuilder, private registerService: RegisterService, private ngZone: NgZone, private route: Router) {
    this.formGroup = this.formBuilder.group({
      firstName: ["", Validators.required],
      surname: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, passwordStrengthValidator(this.commonWords)]],
      company: ["", Validators.required],
      description: [""],
      agreements: ["", Validators.requiredTrue],
      registeredAddress: null,
      zoneId: [Intl.DateTimeFormat().resolvedOptions().timeZone, Validators.compose([Validators.required])],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    
    if (this.formGroup.invalid) {
      return;
    }

    const registeredAddress = this.formGroup.controls.registeredAddress.value;

    const user: User = {
      emailAddress: this.formGroup.controls.email.value,
      firstName: this.formGroup.controls.firstName.value,
      surname: this.formGroup.controls.surname.value,
      password: this.formGroup.controls.password.value,
      zoneId: this.formGroup.controls.zoneId.value,
    };
    const collaborators: AccountCollaborator[] = [];
    const collaborator: AccountCollaborator = {
      userDetail: user,
    };
    collaborators.push(collaborator);
    const registereTenant: RegisterTenant = {
      legalName: this.formGroup.controls.company.value,
      registeredAddress: registeredAddress,
      collaborators: collaborators,
    };

    this.registerService.registerMerchant(registereTenant).subscribe(
      (data) => {
        this.ngZone.run(() => {
          if (data.status !== 200) {
            return;
          }

          this.route.navigate(["/confirmation-required/"]);
        });
      },
      (error) => {
        if (error?.error) {
      
          const code = error?.error?.error || error?.error.message
          switch (code) {
            case "1000":
              this.alert.message = "Email address is already registered";
              break;
            case "1100":
              this.alert.message = "Business is already registered";
              break;
          }

          this.showAlert = true;
          this.alert.type = "error";
        } else {
          SWALMIXIN.fire({
            icon: "error",
            title: error.message,
          });
        }
      }
    );
  }
}
