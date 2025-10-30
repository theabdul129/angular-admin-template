import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from 'rxjs';
import { StoreService } from '../../store.service';
import { StoreDetailComponent } from '../store-detail.component';

@Component({
  selector: 'app-store-api',
  templateUrl: './store-api.component.html',
})
export class StoreApiComponent implements OnInit {
  userForm: UntypedFormGroup;
  selectedStoreId;
  apiKeys: any;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();

  heading = "API Access";
  icon = "pe-7s-display1 icon-gradient bg-premium-dark";
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: Router,
    private storeApiService: StoreService,
    private storeComponent: StoreDetailComponent,
  ) { }

  onSubmit() {
    if (this.userForm.invalid) return;
    const registerPayload = {
      environment: this.userForm.controls.environment.value,
    };
    this.isLoading.next(true);
    this.storeApiService
      .getApiKey(registerPayload, this.selectedStoreId)
      .subscribe(data => {
        this.isLoading.next(false);
        if (data.status === 200) this.apiKeys = data.body
      });
  }

  ngOnInit() {
    let storeId = this.route.url.split(['/'][0]);
    this.selectedStoreId = Number(storeId[4]);
    this.userForm = this.formBuilder.group({
      environment: [null, Validators.compose([Validators.required])],
    });
  }

  toggleDrawer() {
    this.storeComponent.matDrawer.toggle();
  }

}
