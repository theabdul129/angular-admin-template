import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomerDetailComponent } from '../customer-detail.component';
import { CustomerService } from '../../customer.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs/operators';
import { SendNotificationOptionsComponent } from 'app/shared/send-notification-options/send-notification-options.component';
import { SWALMIXIN } from 'app/core/services/mixin.service';

@Component({
    selector: 'customer-view',
    templateUrl: './view-detail.component.html'
})
export class CustomerViewDetailComponent implements OnInit {

    customerId: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    formSubmitted: boolean = false;
    customer: any;
    pageSize: number = 4;
    pageNumber: number = 0;
    displayedColumns: string[] = ['orderid', 'id', 'name', 'status', 'created'];
    displayedColumns2: string[] = ['id', 'name', 'created', 'term'];
    dataSource: any = [];
    dataSource2: any = [];
    errorMsg:any;
    private _unsubscribeAll: Subject<any> = new Subject(); // for unsbscribe the on leaving the component
    customerInsights:any;
    customerInsightsDetailData:any;

    constructor(
        private route: Router,
        public dialog: MatDialog,
        private customerComponent: CustomerDetailComponent,
        private customerService: CustomerService,
        private location: Location
    ) { }

    ngOnInit() {
      if(window.innerWidth<769)this.toggleDrawer();
        let id = this.route.url.split(['/'][0]);
        this.customerId = id[3];
        if (this.customerId>0) {
            this.loadCustomer();
            this.getOrders();
            this.retrieveDiscoveryByCustomerId();
            this.retrieveCustomerInsights()
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    retrieveCustomerInsights(){
        this.isLoading.next(true);
        this.customerService.retrieveCustomerInsights(this.customerId)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
            next:(resp)=>{
                this.isLoading.next(false);
                this.customerInsightsDetailData=resp;
            },
            error:(err)=>{
                this.customerInsightsDetailData = {
                    "header": "Example insight based on your showroom",
                    "recommendations": [
                      {
                        "description": "Product recommendation",
                        "product": {
                          "id": 2,
                          "name": "FORD FOCUS 2021 ST m365",
                          "image_link": "https://example.com/fake-ford-focus-image"
                        },
                        "details": [
                          {
                            "type": "information ",
                            "description": "Jessie will be ready to buy within 30 days"
                          },
                          {
                            "type": "action ",
                            "description": "More information is needed, I've sent a request to Jessie for her marriage certificate"
                          },
                          {
                            "type": "information ",
                            "header": "deposit",
                            "description": "20000"
                          },
                          {
                            "type": "information ",
                            "header": "deposit",
                            "description": "20000"
                          },
                          {
                            "type": "information ",
                            "header": "monthly_payment",
                            "description": "£208.51"
                          },
                          {
                            "type": "information ",
                            "header": "monthly_payment",
                            "description": "£208.51"
                          },
                          {
                            "type": "information ",
                            "header": "term",
                            "description": "48 months"
                          },
                          {
                            "type": "information ",
                            "header": "APR",
                            "description": "12.9%"
                          },
                          {
                            "type": "information ",
                            "header": "total payable amount",
                            "description": "TPA £17,926.04"
                          }
                        ],
                        "business_outcomes": [
                          {
                            "type": "information ",
                            "header": "revenue",
                            "description": "£1300"
                          }
                        ],
                        "basket_recommendations": [
                          {
                            "products": [
                              {
                                "id": 2,
                                "name": "AP insurance",
                                "image_link": "https://example.com/fake-ford-focus-image"
                              },
                              {
                                "id": 2,
                                "name": "service plan",
                                "image_link": "https://example.com/fake-ford-focus-image"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "description": "Part Exchange Opportunity",
                        "product": {
                          "id": 2,
                          "name": "SUZUKI SWIFT 2021 1.2 NAV SZ-L",
                          "image_link": "https://example.com/fake-ford-focus-image"
                        },
                        "details": [
                          {
                            "type": "information ",
                            "header": "Equity",
                            "description": "£5000 positive equity"
                          },
                          {
                            "type": "information ",
                            "description": "I have 4 other customers ready to buy this car"
                          }
                        ],
                        "business_outcomes": [
                          {
                            "type": "information ",
                            "header": "revenue",
                            "description": "£1300"
                          }
                        ],
                        "basket_recommendations": []
                      },
                      {
                        "description": "I'VE FOUND A DEPENDANT IN HER HOUSEHOLD WHO IS ALSO LOOKING FOR A CAR...",
                        "product": {
                          "id": 3,
                          "name": "FIAT 500 2016 1.2 POP 3DR",
                          "image_link": "https://example.com/fake-ford-focus-image"
                        },
                        "details": [],
                        "business_outcomes": [
                          {
                            "type": "information ",
                            "header": "revenue",
                            "description": "£1300"
                          }
                        ],
                        "basket_recommendations": []
                      }
                    ],
                    "future_plans": [
                      "refinance within 3 years",
                      "reduce their APR to 10%",
                      "increase their monthly budget to £500 per month",
                      "want a car that prioritises luxury over utility"
                    ],
                    "follow_up": "I will keep in touch with Jessie and update them on our cars when they're ready to buy",
                    "bskt_score": "27.16"
                  }
                this.isLoading.next(false);
            }
        })
    }

    retrieveDiscoveryByCustomerId(){
        this.isLoading.next(true);
        this.customerService.retrieveDiscoveryByCustomerId(this.customerId)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
            next:(resp)=>{
                this.isLoading.next(false);
                this.customerInsights=resp;
            },
            error:(err)=>{
                this.isLoading.next(false);
            }
        })
    }

    getOrders() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.customerService.getOrders(this.customerId, this.pageNumber, this.pageSize)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data: any) => {
            this.dataSource.data = data.data;
            this.isLoading.next(false);
        }, error => {
            this.isLoading.next(false);
            this.errorMsg = error.message;
        })
    }

    loadCustomer() {
        this.isLoading.next(true);
        this.customerService.get(this.customerId)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(data => {
            this.isLoading.next(false);
            this.customer = data;
            if(data?.addresess && data?.addresess?.length>0) this.dataSource2 = data?.addresess.slice(0,4);
        });
        
        this.customerService.getCustomerAddresses(this.customerId,5,0)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((data:apiRequest) => {
            this.isLoading.next(false);
            if(data.data?.length>0){
                this.dataSource2=data.data;
            }
        });
    }

    back() {
        this.location.back();
    }

    toggleDrawer() {
        this.customerComponent.matDrawer.toggle();
    }

    openNotifcationModal(){
        const dialogRef = this.dialog.open(SendNotificationOptionsComponent, {
            width: '500px',
          });
        
          dialogRef.afterClosed().subscribe(async (dialogResult) => {
            if (dialogResult) {
                this.isLoading.next(true);
                this.customerService.customerSendNotificationMethod(dialogResult,this.customerId)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((data: any) => {
                    this.isLoading.next(false);
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


interface apiRequest{
    currentPage:number;
    data:any[];
    pageSize:number;
    totalPages:number;
    totalSize:number
}