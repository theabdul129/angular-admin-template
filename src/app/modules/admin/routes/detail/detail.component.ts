import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { RoutesService } from '../routes.service';

@Component({
  selector: 'routes-detail',
  templateUrl: './detail.component.html'
})
export class RouteDetailComponent implements OnInit {

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
  routeDate: any;
  routeData: any;
  apiData = {
    "googleMapDirections": "string",
    "routeDate": "2021-12-09T11:36:46.152Z",
    "routeOrders": {
      "currentPage": 0,
      "data": [
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
              "createdAt": "2021-12-09T11:36:46.152Z",
              "heading": 0,
              "id": 0,
              "latitude": 21.291,
              "longitude": -157.821,
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
              "latitude": -18.142,
              "longitude": 178.431,
              "phoneNumber": "string",
              "placeId": "string",
              "postcode": "string",
              "region": "string"
            },
            "name": "string"
          },
          "estimatedArrivalTimeFinish": "2021-12-09T11:36:46.152Z",
          "estimatedArrivalTimeStart": "2021-12-09T11:36:46.152Z",
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
              "latitude": 37.772,
              "longitude": -122.214,
              "phoneNumber": "string",
              "placeId": "string",
              "postcode": "string",
              "region": "string"
            },
            "name": "string"
          },
          "type": "string"
        },
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
              "createdAt": "2021-12-09T11:36:46.152Z",
              "heading": 0,
              "id": 0,
              "latitude": 21.290,
              "longitude": -157.00,
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
              "latitude": -18.200,
              "longitude": 178.300,
              "phoneNumber": "string",
              "placeId": "string",
              "postcode": "string",
              "region": "string"
            },
            "name": "string"
          },
          "estimatedArrivalTimeFinish": "2021-12-09T11:36:46.152Z",
          "estimatedArrivalTimeStart": "2021-12-09T11:36:46.152Z",
          "id": 0,
          "orderId": 0,
          "pickupWayPoints": [
            "string"
          ],
          "routeIndex": 1,
          "startingAddress": {
            "address": {
              "address1": "string",
              "address2": "string",
              "city": "string",
              "id": 0,
              "latitude": 37.111,
              "longitude": -122.111,
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
      "pageSize": 0,
      "totalPages": 0,
      "totalSize": 0
    }
  };
  courierData: any;
  routeId: any;
  zoom: number = 2;

  constructor(
    private route: Router,
    private routesService: RoutesService
  ) { }

  ngOnInit() {
    let id = this.route.url.split(['/'][0]);
    this.routeId = Number(id[3]);
    this.getData();
  }

  dateChange() {
    this.getData();
  }

  clear() {
    this.routeDate = null;
    this.getData();
  }

  getData() {
    this.routesService.get(this.routeId).subscribe((data: any) => {
      this.routeData = data;
    })
  }

}