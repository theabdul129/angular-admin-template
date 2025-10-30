import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreDetail } from 'app/models/storedetail';
import { StoreLocation } from 'app/models/location';
import { MatDialog } from '@angular/material/dialog';
import { Location as LocationCommon } from '@angular/common';
import { CalendarPeriod } from 'app/models/calendarperiod';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { StoreService } from '../store.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'addStore',
  templateUrl: './add-store.component.html'
})
export class AddStoreComponent implements OnInit {

  userForm: UntypedFormGroup;
  selectedStoreId: number;
  isTouchAddress = false;
  @Input() selectedStore: StoreDetail;
  storeCurrentLocation: StoreLocation;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
  panelOpenState = false;
  selectedStoreBlock;
  calendarPeriod: CalendarPeriod;
  businessAccount: any;

  constructor(
    private fb: UntypedFormBuilder,
    private storeService: StoreService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private locationCommon: LocationCommon,
    private router : Router
  ) {
    this.userForm = this.fb.group({
      id: [null],
      name: [null, Validators.compose([Validators.required])],
      description: [null],
      website: [null],
      storeAddress: ['', [Validators.required]],
      registeredAddress: [null],
      acceptOrderMethod: [null, Validators.required],
      webHookUrl: [null]
    });
  }

  ngOnInit() {
    this.route.url.subscribe((data) => {
      if (data.length > 2) {
        this.businessAccount = this.route.snapshot.paramMap.get('id');
      } else {this.selectedStoreId = Number(this.route.snapshot.paramMap.get('id'));}
    });
    if (this.selectedStoreId) {this.loadStore();}
  }

  loadStore() {
    this.isLoading.next(true);
    this.storeService.storeDetail(this.selectedStoreId).subscribe((data) => {
      this.selectedStore = data;
      this.isLoading.next(false);
      this.userForm.patchValue({
        id: this.selectedStore.id,
        website: this.selectedStore.website,
        name: this.selectedStore.name,
        webHookUrl: this.selectedStore.webHookUrl,
        description: this.selectedStore.description,
        storeAddress: this.selectedStore.storeAddress,
        registeredAddress: this.selectedStore.registeredAddress,
        acceptOrderMethod: this.selectedStore.acceptOrderMethod
      });
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {return;}

    if (!this.userForm.controls.storeAddress.value.latitude) {
     this.isTouchAddress = true;
     SWALMIXIN.fire({
      icon: 'error',
      title: 'Please add store address.',
    });
    return;}
    
    const registerPayload: StoreDetail = {
      name: this.userForm.controls.name.value,
      description: this.userForm.controls.description.value,
      website: this.userForm.controls.website.value,
      webHookUrl: this.userForm.controls.webHookUrl.value,
      storeAddress: this.userForm.controls.storeAddress.value,
      id: this.selectedStoreId,
      acceptOrderMethod: this.userForm.controls.acceptOrderMethod.value,
    };
    this.isLoading.next(true);
    if (this.selectedStoreId > 0) {
      this.storeService
        .updateStore(registerPayload, this.selectedStoreId)
        .subscribe((data) => {
          this.isLoading.next(false);
          if(data.status != 200) {return;}
          SWALMIXIN.fire({
            icon: 'success',
            title: 'Your store has been updated.',
          });
          this.loadStore();
        }, (error) => {
          this.isLoading.next(false);
          SWALMIXIN.fire({
            icon: 'error',
            title: error.error.errorMessage,
          });
        });
    } else {
      this.storeService.createStore(registerPayload).subscribe((data) => {
        this.isLoading.next(false);
        if(data.status != 200) {return;}
        SWALMIXIN.fire({
          icon: 'success',
          title: 'Your store details have been saved.',
        });
        this.router.navigateByUrl('admin/stores/edit/'+data.body.id);
      }, (error) => {
        this.isLoading.next(false);
        SWALMIXIN.fire({
          icon: 'error',
          title: error.error.errorMessage,
        });
      });
    }
  }

}
