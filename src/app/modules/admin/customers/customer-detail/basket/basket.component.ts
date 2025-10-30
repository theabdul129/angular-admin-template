import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { BusinessAccountService } from 'app/modules/admin/business-accounts/business-account.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { CustomerService } from '../../customer.service';
import { CustomerDetailComponent } from '../customer-detail.component';
import { takeUntil } from 'rxjs/operators';
import { SendNotificationOptionsComponent } from 'app/shared/send-notification-options/send-notification-options.component';

@Component({
    selector: 'customer-basket',
    templateUrl: './basket.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasketComponent implements OnInit ,OnDestroy{

    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['id', 'created', 'name', 'term', 'action'];
    dataSource: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    errorMsg: any;
    totalAccounts: any;
    customerId: any;
    form: UntypedFormGroup;
    selectedData: any;
    products: any;
    productQuantity = 0;
    costInfo: any;
    currencyType;
    isDisable: boolean = false;
    basketInfo;
    orderGenerated: boolean = false;
    orderData;
    businessAccount;
    couponform: UntypedFormGroup;
    couponsList;
    deliveryform: UntypedFormGroup;
    billingForm: UntypedFormGroup;

    private _unsubscribeAll: Subject<any> = new Subject(); // for unsbscribe the on leaving the component
    
    constructor(
        private route: Router,
        private dialog: MatDialog,
        private formBuilder: UntypedFormBuilder,
        private customerService: CustomerService,
        private customerComponent: CustomerDetailComponent,
        private businessService: BusinessAccountService,
    ) {
        this.form = this.formBuilder.group({
            product: [''],
            quantity: [0],
            unitPrice: [''],
            currency: [''],
            total: [0]
        });
        this.couponform = this.formBuilder.group({
            coupon: ['', Validators.required]
        });
        this.deliveryform = this.formBuilder.group({
            address: ['']
        });
        this.billingForm=this.formBuilder.group({
            address:['']
        })
    }

    ngOnInit() {
        if(window.innerWidth<769)this.toggleDrawer();
        let id = this.route.url.split(['/'][0]);
        this.customerId = id[3];
        if (this.customerId) this.loadBasket();
        this.businessService.getBusinessAccount().subscribe((data) => this.businessAccount = data);
        this.customerService.getCoupons(this.customerId, 0, 500).subscribe(data => this.couponsList = data.data);

    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    openCoupon(modal) {
        this.couponform.reset();
        this.dialog.open(modal, { width: '500px' });
    }

    addCoupon() {
        this.isLoading.next(true);
        this.customerService.addCouponBasket(this.customerId, this.couponform.value.coupon.id).subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your basket details have been saved.',
            });
            this.couponform.reset();
            this.dialog.closeAll();
            this.loadBasket();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: "Coupon Already Applied to a Basket.",
            });
        });
    }

    loadBasket() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.customerService.getBasket(this.customerId).subscribe((data: any) => {
            this.dataSource.data = data.basketProducts.data;
            this.costInfo = data.cost;
            this.currencyType = this.costInfo?.productPrices[0]?.currency;
            this.isLoading.next(false);
            this.basketInfo = data;
        }, error => {
            this.isLoading.next(false);
            this.errorMsg = error.message;
        })
    }

    toggleDrawer() {
        this.customerComponent.matDrawer.toggle();
    }

    openModal(modal, data) {
        console.log(this.form)
        this.form.reset();
        this.dialog.open(modal, { width: '650px' });
        if (data) {

            console.log(data)
            console.log(this.currencyType)
            this.form.controls.product.setValue(data.product);
            this.form.controls.quantity.setValue(data.quantity);
            this.form.controls.currency.setValue( data.price.currency )
            this.productQuantity = data.quantity;
            
            let unitPrice = data.price.unitPrice / 100;
            this.form.controls.unitPrice.setValue(unitPrice)
            this.form.controls.total.setValue(unitPrice * this.productQuantity);
            this.isDisable = true;

            console.log(this.form)
        } else {
            this.isDisable = false;
            this.productQuantity = 0;
        }
    }

    closeModal() {
        this.selectedData = null;
        this.dialog.closeAll();
    }

    productInfo(product) {
        if (product.value) {
            // this.form.controls.unitPrice.setValue(product.value.unitPrice / 100);
            // this.form.controls.currency.setValue(product.value.currency);
            return true;
        }
        else return false;
    }

    plusQuantity() {
        let unitPrice = this.form.controls.unitPrice.value;
        this.productQuantity++;
        this.form.controls.quantity.setValue(this.productQuantity);
        this.form.controls.total.setValue(unitPrice * this.productQuantity);
        this.form.updateValueAndValidity();
    }

    minusQuantity() {
        let unitPrice = this.form.controls.unitPrice.value;
        if (this.productQuantity > 1) this.productQuantity--;
        this.form.controls.quantity.setValue(this.productQuantity);
        this.form.controls.total.setValue(unitPrice * this.productQuantity);
    }

    onSubmit() {
        let cart: any = {};
        cart.product = this.form.value.product;
        cart.quantity = this.form.value.quantity;
        cart.price = { currency: this.form.value.currency, subTotal: this.form.value.total, unitPrice: this.form.value.unitPrice };
        this.isLoading.next(true);
        console.log('cart =>', cart)
        this.customerService.addProduct(this.customerId, cart, this.isDisable).subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your basket details have been saved.',
            });
            this.form.reset();
            this.dialog.closeAll();
            this.loadBasket();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    deleteBasket(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.customerService.deleteProduct(this.customerId, id).subscribe(data => {
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Removed successfuly.',
                    });
                    this.loadBasket();
                }, error => {
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                });
            }
        });
    }

    completeBasket() {
        this.isLoading.next(true);
        this.customerService.completeBasket(this.customerId, this.basketInfo.id).subscribe(data => {
            if (data.status != 200) return;
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Completed successfuly.',
            });
            this.loadBasket();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    print() {
        window.print();
    }

    generateOrder() {
        
        this.orderGenerated = true;
    }

    addDelivery(modal) {
        this.dialog.open(modal, { width: '650px' });
    }

    addAddress() {
        this.isLoading.next(true);
        this.customerService.addDeliveryAddress(this.customerId, this.deliveryform.value.address).subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your address details have been saved.',
            });
            this.dialog.closeAll();
            this.loadBasket();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
            });
        });
    }

    onProductChange(event){
     
       this.form.controls.unitPrice.setValue(event.unitPrice / 100);
        this.form.controls.currency.setValue(event.currency);
    }

    gotSelectedData(data){
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
        this.customerService.addShipingAddress(this.customerId,payload)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your address details have been saved.',
            });
            this.dialog.closeAll();
            this.loadBasket();
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
        this.customerService.addBillingAddress(this.customerId,payload)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: any) => {
            this.isLoading.next(false);
            if (data.status != 200) return;
            SWALMIXIN.fire({
                icon: 'success',
                title: 'Your address details have been saved.',
            });
            this.dialog.closeAll();
            this.loadBasket();
        }, error => {
            this.isLoading.next(false);
            SWALMIXIN.fire({
                icon: 'error',
                title: error?.error?.message,
            });
        });
    }

    gotToAllAddresses(){
        this.route.navigateByUrl(`/admin/customers/${this.customerId}/delivery-address`)
    }

    openNotifcationModal(){
        const dialogRef = this.dialog.open(SendNotificationOptionsComponent, {
            width: '500px',
          });

        dialogRef.afterClosed().subscribe(async (dialogResult) => {
            if (dialogResult) {
                this.isLoading.next(true);
                this.customerService.basketSendNotificationMethod(dialogResult,this.customerId)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((data: any) => {
                    this.isLoading.next(false);
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Success',
                    });
                }, (error) => {
                    this.isLoading.next(false);
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error?.error?.message ||error?.message,
                    });
                });
            }
          });
    }
}