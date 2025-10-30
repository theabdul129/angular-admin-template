import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { SWALMIXIN } from "app/core/services/mixin.service";
import { BasicNameValuePair } from "app/models/basicnamevaluepair";
import { BusinessAccount } from "app/models/businessaccount";
import { StoreCollaborator } from "app/models/storecollaborator";
import { BehaviorSubject, Observable } from "rxjs";
import { CollaboratorService } from "../collaborators.service";
import { SearchCountryField, CountryISO, PhoneNumberFormat } from "ngx-intl-tel-input-gg";
import { MatPaginator, PageEvent } from "@angular/material/paginator";

@Component({
  selector: "app-list-business-account-collaborators",
  templateUrl: "./list-business-account-collaborators.component.html",
  styles: [],
})
export class ListBusinessAccountCollaboratorsComponent implements OnInit {
  @Input()
  control: UntypedFormControl;
  storeCollaborators: Array<StoreCollaborator>;
  @Input() businessAccount: BusinessAccount;
  selectedStoreCollaborator: StoreCollaborator;
  storeCollaboratorPrivileges: BasicNameValuePair[];
  userForm: UntypedFormGroup;
  inviteAccountCollaboratorForm: UntypedFormGroup;

  isAccountCollaboratorSubmited: boolean = false;

  displayedColumns: string[] = ["name", "email", "action"];
  dataSource: any;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
  errorMsg: any;
  totalAccounts: any;
  pageSize: number = 10;
  pageNumber: number = 0;
  dialogRef: MatDialogRef<any>;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

  constructor(private formBuilder: UntypedFormBuilder, private businessService: CollaboratorService, public dialog: MatDialog) {}

  ngOnInit() {
    // this.businessService.getAllRoles().subscribe((data) => {
    // this.storeCollaboratorPrivileges = data;
    this.loadCollaborators();
    //});
    this.initForm();
  }

  initForm() {
    this.inviteAccountCollaboratorForm = this.formBuilder.group({
      firstName: [null, Validators.compose([Validators.required])],
      emailAddress: [null, [Validators.required, Validators.email]],
      surname: [null, Validators.compose([Validators.required])],
      zoneId: [Intl.DateTimeFormat().resolvedOptions().timeZone, Validators.compose([Validators.required])],
    });

    this.userForm = this.formBuilder.group({
      businessAccountId: [null, Validators.compose([Validators.required])],
      firstName: [null],
      emailAddress: [null],
      surname: [null],
    });
  }

  loadCollaborators() {
    this.isLoading.next(true);
    this.dataSource = new MatTableDataSource();
    this.businessService.getAllCollaborators(this.pageNumber, this.pageSize).subscribe((collabs) => {
      this.dataSource.data = collabs.data;
      this.totalAccounts = collabs.totalSize;
      this.isLoading.next(false);
    });
  }

  editCollaborator(user, modal) {
    this.selectedStoreCollaborator = user;

    this.userForm.patchValue({
      businessAccountId: this.businessAccount.id,
    });

    this.dialog.open(modal, { width: "500px" });
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const payload = {
      id: this.selectedStoreCollaborator.id,
    };
    this.isLoading.next(true);
    this.businessService.update(payload, this.selectedStoreCollaborator.id).subscribe(
      (data) => {
        this.isLoading.next(false);
        this.closeModal();
        if (data.status != 200) return;
        this.loadCollaborators();
        SWALMIXIN.fire({
          icon: "success",
          title: "Your business account has been updated.",
        });
      },
      (error) => {
        this.isLoading.next(false);
        SWALMIXIN.fire({
          icon: "error",
          title: error.error.errorMessage,
        });
      }
    );
  }

  openModal(modal) {
    this.initForm();
    this.isAccountCollaboratorSubmited = false;
    this.dialog.open(modal, { width: "700px" });
  }

  closeModal() {
    this.dialog.closeAll();
  }

  onInviteSubmit() {
    if (this.inviteAccountCollaboratorForm.invalid) {
      return;
    }
    const payload = {
      userDetail: {
        firstName: this.inviteAccountCollaboratorForm.controls.firstName.value,
        surname: this.inviteAccountCollaboratorForm.controls.surname.value,
        emailAddress: this.inviteAccountCollaboratorForm.controls.emailAddress.value,
        zoneId: this.inviteAccountCollaboratorForm.controls.zoneId.value,
      },
    };

    this.isLoading.next(true);
    this.businessService.inviteUser(payload).subscribe(
      (data) => {
        SWALMIXIN.fire({
          icon: "success",
          title: "Invitation sent successfully",
        });
        this.isLoading.next(false);
        this.loadCollaborators();
        this.isAccountCollaboratorSubmited = true;
      },
      (error) => {
        this.isLoading.next(false);
        SWALMIXIN.fire({
          icon: "error",
          title: error?.error?.errorMessage || error.message,
        });
      }
    );
  }

  paginate(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCollaborators();
  }
}
