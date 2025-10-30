import { Component, OnInit, Input, SimpleChanges } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from "@angular/forms";

import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input-gg';
@Component({
  selector: "app-save-address",
  templateUrl: "./save-address.component.html"
})
export class SaveAddressComponent implements OnInit {
  @Input() address: UntypedFormControl;
  @Input() isTouched: boolean;
  form: UntypedFormGroup;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  constructor(private formBuilder: UntypedFormBuilder) { }

  ngOnInit() {
    if (this.form === undefined) {
      this.defineForm();
    }

    this.form.valueChanges.subscribe(val => {
      if (val != this.address) {
        if (this.address == undefined) {
          this.address = new UntypedFormControl("");
        }
        this.address.setValue({
          id: this.form.controls.id.value,
          address1: val.address1,
          address2: val.address2,
          city: val.city,
          postcode: val.postcode,
          latitude: val.latitude,
          longitude: val.longitude,
          phoneNumber: val.phoneNumber?.internationalNumber,
          countryCode : "GB"
        });
      }

      //
      // if(val == originalFormValue){
      // code to enable submit button
      // }
    });
  }

  defineForm() {
    this.form = this.formBuilder.group({
      id: [null],
      address1: [null, Validators.compose([Validators.required])],
      address2: null,
      city: [null, Validators.compose([Validators.required])],
      postcode: [null, Validators.compose([Validators.required])],
      latitude: [null, Validators.compose([Validators.required])],
      longitude: [null, Validators.compose([Validators.required])],
      phoneNumber: [null],
      countryCode:"GB"
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isTouched) this.form.markAllAsTouched();
    for (const property in changes) {
      if (property === "address") {
        if (this.form === undefined) {
          this.defineForm();
        }
        if (changes[property].currentValue != null && changes[property].currentValue.value) {
          this.form.patchValue({
            id: changes[property].currentValue.value.id,
            address1: changes[property].currentValue.value.address1,
            address2: changes[property].currentValue.value.address2,
            city: changes[property].currentValue.value.city,
            postcode: changes[property].currentValue.value.postcode,
            phoneNumber: changes[property].currentValue.value.phoneNumber,
            latitude: changes[property].currentValue.value.latitude,
            longitude: changes[property].currentValue.value.longitude,
            countryCode: changes[property].currentValue.value.countryCode
          });
        }
      }
    }
  }

  onSelect(selectedAddress) {
    this.form.patchValue({
      address1: selectedAddress.address1,
      address2: selectedAddress.address2,
      city: selectedAddress.city,
      postcode: selectedAddress.postcode,
      latitude: selectedAddress.latitude,
      longitude: selectedAddress.longitude,
      phoneNumber: selectedAddress.phoneNumber,
      countryCode: selectedAddress.countryCode
    });

    if (this.address == undefined) {
      this.address = new UntypedFormControl("");
    }
    this.address.setValue({
      id: this.form.controls.id.value,
      address1: selectedAddress.address1,
      address2: selectedAddress.address2,
      city: selectedAddress.city,
      postcode: selectedAddress.postcode,
      latitude: selectedAddress.latitude,
      longitude: selectedAddress.longitude,
      countryCode: selectedAddress.countryCode,
      phoneNumber: selectedAddress.phoneNumber?.internationalNumber
    });
  }
}
