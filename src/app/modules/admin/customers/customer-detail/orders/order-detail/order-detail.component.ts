import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CustomerService } from '../../../customer.service';
import { CustomerDetailComponent } from '../../customer-detail.component';
import { MatTableDataSource } from '@angular/material/table';
import { BusinessAccountService } from 'app/modules/admin/business-accounts/business-account.service';
import { takeUntil } from 'rxjs/operators';
import {sortBy} from 'lodash';
@Component({
    selector: 'basic-customerOrderDetail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss'],
})
export class CustomerOrderDetailComponent implements OnInit {

    cancelform: UntypedFormGroup;
    refundform: UntypedFormGroup;
    paymentform: UntypedFormGroup;
    orderId: any;
    order: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    displayedColumns: string[] = ['image', 'id', 'name', 'created', 'term'];
    dataSource: any;
    reasons = ['admin_order_cancel', 'admin_order_refund', 'courier_damaged_items', 'courier_failed_provide_items', 'customer_items_no_longer_wanted', 'customer_missing_items_will_rebook', 'payment_cancelled_by_provider', 'store_failed_provide_items', 'store_provided_defect_item']
    formSubmitted: boolean = false;
    orderData: any;
    orderGenerated: boolean = false;
    customerId: any;
    deliveryform: UntypedFormGroup;
    businessAccount;
    statuses : any[];
    storeId;
    activeStatus = '';
    private _unsubscribeAll: Subject<any> = new Subject(); // for unsbscribe the on leaving the component
    billingForm: UntypedFormGroup;

    orderStatuses = [];
    externalReference:string;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: Router,
        public dialog: MatDialog,
        private customerComponent: CustomerDetailComponent,
        private ngZone: NgZone,
        private customerService: CustomerService,
        private location: Location,
        private businessService: BusinessAccountService,
        private cdr:ChangeDetectorRef
    ) {
        this.cancelform = this.formBuilder.group({
            reason: ['', Validators.required],
            refund: [],
            notes: []
        });
        this.refundform = this.formBuilder.group({
            reason: ['', Validators.required],
            quantity: ['', Validators.required],
            notes: [],
            refunded: []
        });
        this.deliveryform = this.formBuilder.group({
            address: ['']
        });
        this.billingForm = this.formBuilder.group({
            address: ['']
        });
    }

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.orderId = Number(id[5]);
        this.customerId = id[3];
        if (this.orderId) this.loadData();
        this.getSystemStatus();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    getSystemStatus() {
        this.businessService.getSystemStatus().subscribe(data => {this.statuses = data
        if(this.order && this.order.status && this.order.status.name){
            this.activeStatus = this.statuses.find(e=>e.systemName == this.order.status.name)
        }
        });
    }

    changeStatus() {
      
        this.businessService.updateOrderStatus(this.storeId, this.orderId, this.activeStatus).subscribe(data => {
            console.log('data',data);
            this.loadData();
        });
    }

    invoice() {
        this.orderGenerated = true;
    }

    print() {
        window.print();
    }

    loadData() {
        this.businessService.getBusinessAccount().subscribe((data) => this.businessAccount = data);
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.customerService.orderDetail(this.orderId).subscribe((data: any) => {
            this.order = data;
            this.externalReference=this.order?.externalReference
            this.cdr.detectChanges();
            this.orderData = data;
            this.storeId = data?.store?.id;
            this.dataSource.data = data.orderProducts;
            if(this.order && this.order.status && this.order.status.name){
                this.activeStatus = this.statuses?.find(e=>e.systemName == this.order.status.name)
            }
            this.isLoading.next(false);
        });
        this.customerService.getOrderStatus(this.orderId).subscribe((res:any) => {

            this.orderStatuses= res.sort((a, b) => {
                const dateA:any = new Date(a.createdAt);
                const dateB:any = new Date(b.createdAt);        
                if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0; // invalid date
                return dateA - dateB;
              });

        })

    }

    removeUnderScore(str : String){
return str.replace(/_/g, ' ');
    }

    toggleDrawer() {
        this.customerComponent.matDrawer.toggle();
    }

    cancelOrder() {
        this.formSubmitted = true;
        if(this.cancelform.invalid) return;
        this.isLoading.next(true);
        this.cancelform.value.id = 0;
        this.customerService.cancelOrder(this.orderId, this.cancelform.value,this.customerId).subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Canceled successfuly.',
            });
            this.location.back();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    refundOrder() {
        this.formSubmitted = true;
        if(this.refundform.invalid) return;
        this.isLoading.next(true);
        this.refundform.value.id = 0;
        this.refundform.value.orderId = this.orderId;
        this.customerService.refundOrder(this.orderId, this.order.orderProducts[0].id, this.refundform.value).subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Refunded successfuly.',
            });
            this.location.back();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    openModal(modal) {
        this.dialog.open(modal, { width: '600px' })
    }

    closeModal() {
        this.formSubmitted = false;
        this.dialog.closeAll();
    }

    addDelivery(modal) {
        this.dialog.open(modal, { width: '650px' });
    }

    gotSelectedData(data){
        console.log("data: ",data);
        this.deliveryform.patchValue({
            address:data
        });
        this.billingForm.patchValue({
            address:data
        });
    }


    addShipingAddress(){
        this.isLoading.next(true);
        let payload={id:this.deliveryform?.value?.address.id}
        // this.customerService.addOrdersShipingAddress(this.customerId,payload)
        this.customerService.addOrdersShipingAddress(this.customerId,this.orderId,payload)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your address details have been saved.',
            });
            this.dialog.closeAll();
            this.loadData();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error?.error?.message,
            });
        });
    }

    addBillingAddress(){
        this.isLoading.next(true);
        let payload={id:this.billingForm?.value?.address.id}
        // this.customerService.addOrdersBillinggAddress(this.customerId,payload)
        this.customerService.addOrdersBillinggAddress(this.customerId,this.orderId,payload)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your address details have been saved.',
            });
            this.dialog.closeAll();
            this.loadData();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error?.error?.message || error?.message,
            });
        });
    }

    goToAllAddresses(){
        this.route.navigateByUrl(`/admin/customers/${this.customerId}/delivery-address`)
    }

    removeUnderscore(inputItem) {
        return inputItem.replace(/_/g, ' ');
    }

    addReferenceNumber(){
        if(!this.externalReference){
            return;
        }
        this.order.externalReference=this.externalReference;
        this.isLoading.next(true);
        this.businessService?.addReferenceNumber(this.orderId,this.order)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
            next:(resp)=>{
                this.isLoading.next(true);
                this.closeModal();
                this.loadData();
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'External reference have been saved.',
                });
            },
            error: (err) => {
                this.isLoading.next(true);
                SWALMIXIN.fire({
                    icon: 'error',
                    title: err?.error?.message||err?.message,
                });
            },
        })
        
    }

    viewPublicReceipt(){
        this.route?.navigate(['invoice/'+this.orderId])
    }

}