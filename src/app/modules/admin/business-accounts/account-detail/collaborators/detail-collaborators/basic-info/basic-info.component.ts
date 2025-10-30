import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { SWALMIXIN } from "app/core/services/mixin.service";
import { Courier } from "app/models/courier";
import { StoreLocation } from "app/models/location";
import { CollaboratorDetailComponent } from "../collaborator-detail.component";
import { User } from "app/models/user";
import { CollaboratorService } from "../../collaborators.service";
import { BehaviorSubject, Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { SearchCountryField, CountryISO, PhoneNumberFormat } from "ngx-intl-tel-input-gg";
import { AuthService } from "@auth0/auth0-angular";

@Component({
  selector: "collaborator-basic-userDetail",
  templateUrl: "./basic-info.component.html",
})
export class UserBasicDetailComponent implements OnInit {
  userForm: FormGroup;
  contactUserForm: FormGroup;
  customerId: any;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
  @Input() selectedCourier: Courier;
  courierCurrentLocation: StoreLocation;
  routes: any[] = [];
  selectedUserId: any;
  selectedUser: any;
  formSubmitted: boolean = false;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  constructor(private formBuilder: FormBuilder, private route: Router, public dialog: MatDialog, private userComponent: CollaboratorDetailComponent, private collaboratorService: CollaboratorService, public auth: AuthService) {
    this.userForm = this.formBuilder.group({
      emailAddress: ["", [Validators.required, Validators.email]],

      firstName: ["", Validators.required],
      surname: [""],

      zoneId: [Intl.DateTimeFormat().resolvedOptions().timeZone, Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    if(window.innerWidth<769)this.toggleDrawer();
    let id = this.route.url.split(["/"][0]);
    this.selectedUserId = Number(id[5]);
    this.loadUser();
  }

  loadUser() {
    this.isLoading.next(true);
    this.collaboratorService.get(this.selectedUserId).subscribe(
      (data) => {
        this.isLoading.next(false);
        this.selectedUser = data;
        this.userForm.patchValue({
          firstName: this.selectedUser.userProfile.firstName,
          surname: this.selectedUser.userProfile.surname,
          primaryPhone: this.selectedUser.userProfile.primaryPhone,
          emailAddress: this.selectedUser.userProfile.emailAddress,
        });
      },
      (Err) => {
        this.isLoading.next(false);
      }
    );
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.userForm.invalid) return;

    const registerPayload = {
      id: this.selectedUser ? this.selectedUser.id : 0,
      firstName: this.userForm.value.firstName,
      surname: this.userForm.value.surname,
      emailAddress: this.userForm.value.emailAddress,
      zoneId: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    this.isLoading.next(true);
    this.collaboratorService
      .update(registerPayload, this.selectedUser.id)
      .pipe(
        finalize(() => {
          this.isLoading.next(false);
        })
      )
      .subscribe(
        (data) => {
          if (data.status != 200) return;
          SWALMIXIN.fire({
            icon: "success",
            title: "Your user has been updated.",
          });

          this.loadUser();
        },
        (error) => {
          SWALMIXIN.fire({
            icon: "error",
            title: error.errorMessage ? error.errorMessage : error.error.errorMessage,
          });
        }
      );
  }

  toggleDrawer() {
    this.userComponent.matDrawer.toggle();
  }
}
