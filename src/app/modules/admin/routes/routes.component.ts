import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DateAdapter } from 'angular-calendar';
import moment from 'moment';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CourierService } from '../couriers/courier.service';
import { RoutesService } from './routes.service';

@Component({
  selector: 'routes-list',
  templateUrl: './routes.component.html',
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class RoutesComponent implements OnInit {

  pageSize: number = 10;
  pageNumber: number = 0;
  displayedColumns: string[] = ['account', 'name', 'email', 'number', 'action'];
  dataSource: any;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
  errorMsg: any;
  totalAccounts: any;
  startDate: any;
  endDate: any;
  couriers: any;
  selectedCouriers: any;
  dateRange = new UntypedFormGroup({
    start: new UntypedFormControl(moment()),
    end: new UntypedFormControl(moment())
  });
  apiData = {
    "currentPage": 0,
    "data": [
      {
        "completedAt": "2021-12-13T04:26:46.024Z",
        "courier": {
          "badgeQRUrl": "string",
          "firstName": "string",
          "id": 0,
          "lastKnownLocation": {
            "accuracy": 0,
            "altitude": 0,
            "altitudeAccuracy": 0,
            "courierOrderId": 0,
            "createdAt": "2021-12-13T04:26:46.024Z",
            "dispatchRouteId": 0,
            "heading": 0,
            "id": 0,
            "latitude": 0,
            "longitude": 0,
            "orderId": 0,
            "speed": 0
          },
          "profileImagePublicUrl": "string",
          "surname": "string"
        },
        "estimatedStartAt": "2021-12-13T04:26:46.024Z",
        "id": 0,
        "routeOrders": [
          {
            "courier": {
              "badgeQRUrl": "string",
              "firstName": "string",
              "id": 0,
              "lastKnownLocation": {
                "accuracy": 0,
                "altitude": 0,
                "altitudeAccuracy": 0,
                "courierOrderId": 0,
                "createdAt": "2021-12-13T04:26:46.024Z",
                "dispatchRouteId": 0,
                "heading": 0,
                "id": 0,
                "latitude": 0,
                "longitude": 0,
                "orderId": 0,
                "speed": 0
              },
              "profileImagePublicUrl": "string",
              "surname": "string"
            },
            "deliveryWayPoints": [
              "string"
            ],
            "destinationAddress": {
              "address": {
                "address1": "string",
                "address2": "string",
                "city": "string",
                "id": 0,
                "latitude": 0,
                "longitude": 0,
                "phoneNumber": "string",
                "placeId": "string",
                "postcode": "string",
                "region": "string"
              },
              "name": "string"
            },
            "estimatedArrivalTimeFinish": "2021-12-13T04:26:46.024Z",
            "estimatedArrivalTimeStart": "2021-12-13T04:26:46.024Z",
            "id": 0,
            "orderId": 0,
            "pickupWayPoints": [
              "string"
            ],
            "routeIndex": 0,
            "startingAddress": {
              "address": {
                "address1": "string",
                "address2": "string",
                "city": "string",
                "id": 0,
                "latitude": 0,
                "longitude": 0,
                "phoneNumber": "string",
                "placeId": "string",
                "postcode": "string",
                "region": "string"
              },
              "name": "string"
            },
            "type": "string"
          }
        ],
        "startedAt": "2021-12-13T04:26:46.024Z",
        "updatedAt": "2021-12-13T04:26:46.024Z"
      }
    ],
    "pageSize": 0,
    "totalPages": 0,
    "totalSize": 0
  }
  public filterCouriers = new ReplaySubject(1);

  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  public courierCtrl: UntypedFormControl = new UntypedFormControl();
  public courierFilterCtrl: UntypedFormControl = new UntypedFormControl();
  constructor(
    private routesService: RoutesService,
    private courierService: CourierService
  ) { }

  ngOnInit() {
    this.getCouriers();
    this.loadData();
  }

  loadData() {
    this.isLoading.next(true);
    this.dataSource = new MatTableDataSource();
    this.routesService.getRoutes(this.startDate, this.endDate, this.selectedCouriers, this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize)
      .subscribe((data: any) => {
        this.dataSource.data = data.data;
        this.dataSource.paginator = this.paginator;
        this.totalAccounts = data.totalSize;
        this.isLoading.next(false);
      }, error => {
        this.isLoading.next(false);
        this.errorMsg = error.message;
      })
  }

  getCouriers() {
    this.courierService.getAll(0, 500).subscribe(data => {
      this.couriers = data.data;
      this.filterCouriers.next(this.couriers.slice());
    });
    this.courierFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterData(this.couriers, this.filterCouriers, this.courierFilterCtrl.value);
      });
  }

  _onDestroy = new Subject();

  filterData(data, filterData, searchVal) {
    if (!data) return;
    let search = searchVal;
    if (!search) {
      filterData.next(data.slice());
      return;
    } else search = search.toLowerCase();
    filterData.next(
      data.filter(item => item.name.toLowerCase().indexOf(search) > -1)
    );
  }

  applyFilter() {
    if (this.dateRange.value.start) this.startDate = moment(this.dateRange.value.start).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    if (this.dateRange.value.end) this.endDate = moment(this.dateRange.value.end).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    this.selectedCouriers = this.courierCtrl.value;
    this.loadData();
  }

  clearFilter() {
    this.dateRange.reset();
    this.startDate = null;
    this.endDate = null;
    this.courierCtrl.reset();
    this.selectedCouriers = null;
    this.loadData();
  }

  paginate(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }
}