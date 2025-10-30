import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreDetail } from 'app/models/storedetail';
import { StoreLocation } from 'app/models/location';
import { MatDialog } from '@angular/material/dialog';
import { Location as LocationCommon } from '@angular/common';
import { CalendarPeriod } from 'app/models/calendarperiod';
import { BookingEvent } from 'app/models/bookingevent';
import { CalendarBlock } from 'app/models/calendarblock';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { StoreService } from '../../store.service';
import { StoreDetailComponent } from '../store-detail.component';
import { StoreDataService } from '../store.data.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'basic-storeDetail',
  templateUrl: './basic-detail.component.html'
})
export class StoreBasicDetailComponent implements OnInit {

  userForm: UntypedFormGroup;
  selectedStoreId: number;
  @Input() selectedStore: StoreDetail;
  storeCurrentLocation: StoreLocation;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
  panelOpenState = false;
  selectedStoreBlock;
  calendarPeriod: CalendarPeriod;
  businessAccount: any;
  formSubmitted: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private storeService: StoreService,
    private route: Router,
    public dialog: MatDialog,
    private locationCommon: LocationCommon,
    private storeComponent: StoreDetailComponent,
    private storeData: StoreDataService
  ) {
    this.userForm = this.fb.group({
      id: [null],
      name: [null, Validators.compose([Validators.required])],
      description: [null],
      website: [null],
      storeAddress: [null, Validators.compose([Validators.required])],
      registeredAddress: [null],
      acceptOrderMethod: [null, Validators.required],
      webHookUrl: [null]
    });
  }

  ngOnInit() {
    const storeId = this.route.url.split(['/'][0]);
    this.selectedStoreId = Number(storeId[4]);
    this.loadStore();
    this.toggleDrawer();
  }

  loadStore() {
    this.storeCurrentLocation = {
      latitude: 0,
      longitude: 0,
      mapType: 'satelite',
      zoom: 8,
      marker: null,
      markers: []
    };
    this.isLoading.next(true);
    this.storeService.storeDetail(this.selectedStoreId).subscribe((data) => {
      this.isLoading.next(false);
      this.selectedStore = data;
      this.storeData.newStore(this.selectedStore);
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
      this.storeCurrentLocation.latitude = this.selectedStore.storeAddress?.latitude;
      this.storeCurrentLocation.longitude = this.selectedStore.storeAddress?.longitude;
    });
  }

  openModal(modal) {
    this.dialog.open(modal, { width: '650px' });
  }

  closeModal() {
    this.dialog.closeAll();
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.userForm.invalid)  {return;}
    const registerPayload: StoreDetail = {
      name: this.userForm.controls.name.value,
      description: this.userForm.controls.description.value,
      website: this.userForm.controls.website.value,
      webHookUrl: this.userForm.controls.webHookUrl.value,
      storeAddress: this.userForm.controls.storeAddress.value,
      // registeredAddress: this.userForm.controls.registeredAddress.value,
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
        this.locationCommon.go('admin/stores');
      }, (error) => {
        this.isLoading.next(false);
        SWALMIXIN.fire({
          icon: 'error',
          title: error.error.errorMessage,
        });
      });
    }
  }

  onAddCalendarBlock(event, modal) {
    this.selectedStoreBlock = event;
    this.dialog.open(modal, { width: '650px' });
  }

  handleDateClick() {

  }

  mapBookingEvent(event): BookingEvent {
    return {
      id: event.id,
      bookingId: event.bookingId,
      title: event.title,
      startAt: new Date(event.startAt * 1000),
      endAt: new Date(event.endAt * 1000),
      allDay: event.allDay,
      url: '/bookings/view/?bid=' + event.id + '&cid=' + event.customerId
    };
  }

  mapStoreCalendarBlock(event): CalendarBlock {
    return {
      id: event.id,
      title: event.title,
      startAt: new Date(event.startAt * 1000),
      endAt: new Date(event.endAt * 1000),
      allDay: event.allDay,
      repeatInterval: event.repeatInterval,
      archived: event.archived,
      repeatUntil: event.repeatUntil,
      description: event.description
    };
  }

  changeEnvironment(environment) {
    this.isLoading.next(true);
    this.storeService
      .changeEnvironment({ environment: environment }, this.selectedStore.id)
      .subscribe((data) => {
        this.isLoading.next(false);
        if(data.status != 200) {return;}
        this.loadStore();
        SWALMIXIN.fire({
          icon: 'success',
          title: 'Environment changed successfully.',
        });
        this.dialog.closeAll();
      }, (error)=> {
        this.isLoading.next(false);
        this.dialog.closeAll();
        SWALMIXIN.fire({
          icon: 'error',
          title: error.error.errorMessage,
        });
      });
  }

  archiveStore() {
    this.isLoading.next(true);
    this.storeService.archiveStore(this.selectedStore.id).subscribe((data) => {
      this.dialog.closeAll();
      this.isLoading.next(false);
      if(data.status != 200) {return;}
      SWALMIXIN.fire({
        icon: 'success',
        title: 'Archived successfully.',
      });
    }, (error) => {
      this.isLoading.next(false);
      SWALMIXIN.fire({
        icon: 'error',
        title: error.error.errorMessage,
      });
    });
  }

  hideStore() {
    this.isLoading.next(true);
    this.storeService.disableStore(this.selectedStore.id).subscribe((data) => {
      this.isLoading.next(false);
      if(data.status != 200) {return;}
      this.loadStore();
      this.dialog.closeAll();
      SWALMIXIN.fire({
        icon: 'success',
        title: 'Hidden successfully.',
      });
    }, (error) => {
      this.isLoading.next(false);
      SWALMIXIN.fire({
        icon: 'error',
        title: error.error.errorMessage,
      });
    });
  }

  liveStore() {
    this.isLoading.next(true);
    this.storeService.approveStore(this.selectedStore.id).subscribe((data) => {
      this.isLoading.next(false);
      if(data.status != 200) {return;}
      this.loadStore();
      this.dialog.closeAll();
      SWALMIXIN.fire({
        icon: 'success',
        title: 'Lived sucessfully',
      });
    }, (error) => {
      this.isLoading.next(false);
      SWALMIXIN.fire({
        icon: 'error',
        title: error.error.errorMessage,
      });
    });
  }

  toggleDrawer() {
    this.storeComponent.matDrawer.toggle();
  }

}
