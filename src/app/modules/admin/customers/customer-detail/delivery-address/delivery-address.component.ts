import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { CustomerService } from '../../customer.service';
import { CustomerDetailComponent } from '../customer-detail.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { takeUntil } from 'rxjs/operators';
import { SaveDeliveryAddressComponent } from 'app/shared/save-delivery-address/save-delivery-address.component';
import { BasicActions } from 'app/shared/basic-actions';

@Component({
    selector: 'delivery-address',
    templateUrl: './delivery-address.component.html',
})
export class DeliveryAddressComponent extends BasicActions implements OnInit {
    displayedColumns: string[] = ['id', 'name', 'created', 'term', 'action'];
    dataSource: any;
    errorMsg: any;
    customerId: any;
    form: UntypedFormGroup;
    selectedData: any;
    products: any;
    private _confirmDialogRef: any; //Confirmation Dialod for delete
    // paginate table properties
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        private route: Router,
        private dialog: MatDialog,
        private customerService: CustomerService,
        private customerComponent: CustomerDetailComponent,
        private _fuseConfirmationService: FuseConfirmationService,
        private formBuilder:UntypedFormBuilder
    ) {
        super(customerComponent);
        this.form = this.formBuilder.group({
            address: [''],
        });
    }

    ngOnInit() {
        if(window.innerWidth<769)this.toggleDrawer();
        let id = this.route.url.split(['/'][0]);
        this.customerId = id[3];
        if (this.customerId == 'add') {
            SWALMIXIN.fire({
                icon: 'error',
                title: 'Please add customer basic detail first',
            });
            this.route.navigateByUrl('/admin/customers/add/add-detail');
            return;
        }
        if (this.customerId) this.loadCustomer();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        if (this._subscriptions.getData) {
            this._subscriptions.getData.unsubscribe();
        }
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    loadCustomer() {
        if (this._subscriptions.getData) {
            this._subscriptions.getData.unsubscribe();
        }
        this.loading(true);
        this.dataSource = new MatTableDataSource();
        this._subscriptions.getData = this.customerService
            .getCustomerAddresses(
                this.customerId,
                this.filterOptions.limit,
                this.filterOptions.page
            )
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (data: any) => {
                    this.dataSource.data = data.data;
                    this.tableAttributes.totalRecords = data.totalSize;
                    this.loading(false);
                },
                (error) => {
                    this.loading(false);
                    this.errorMsg = error.message;
                }
            );
    }

    public paginate(event: PageEvent): void {
        this.filterOptions.limit = event.pageSize;
        this.filterOptions.page = event.pageIndex;
        this.loadCustomer();
    }

    openModal(data) {
        this.selectedData = data;
        const dialogRef = this.dialog.open(SaveDeliveryAddressComponent, {
            width: '700px',
            data:this.selectedData?this.selectedData:null
          });

        dialogRef.afterClosed().subscribe(async (dialogResult) => {
            if (dialogResult) {
                this.form.value.address=dialogResult;
                this.onSubmit();
            }
          });
    }

    onSubmit() {
        this.selectedData ? this.updateData() : this.saveData();
    }

    saveData() {
        this.loading(true);
        this.customerService
            .addDeliveryAddress(this.customerId, this.form.value.address)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (data: any) => {
                    this.loading(false);
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Your address details have been saved.',
                    });
                    this.dialog.closeAll();
                    this.loadCustomer();
                },
                (error) => {
                    this.loading(false);
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.message,
                    });
                }
            );
    }

    updateData() {
        this.loading(true);
        this.customerService
            .updateDeliveryAddress(
                this.customerId,
                this.selectedData.id,
                this.form.value.address
            )
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (data: any) => {
                    this.loading(false);
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Your product has been updated.',
                    });
                    this.loadCustomer();
                },
                (error) => {
                    this.isLoading.next(false);
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.message,
                    });
                }
            );
    }

    deleteAddress(id) {
        this._confirmDialogRef = this._fuseConfirmationService.open();
        this._confirmDialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                this.loading(true);
                this.customerService
                    .deleteDeliveryAddress(this.customerId, id)
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe(
                        (data) => {
                            this.loading(false);
                            if (data.status != 200) return;
                            SWALMIXIN.fire({
                                icon: 'success',
                                title: 'Removed successfuly.',
                            });
                            this.loadCustomer();
                        },
                        (error) => {
                            this.loading(false);
                            SWALMIXIN.fire({
                                icon: 'error',
                                title: error.error.message,
                            });
                        }
                    );
            }
            this._confirmDialogRef = null;
        });
    }
}