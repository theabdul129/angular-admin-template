
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatchmentAreaService {
  constructor(private http: HttpClient) {
  }

  save(payload, id): Observable<any> {
    if (!id) return this.http.put(environment.apiUrl + '/admin/catchmentArea/', payload, { observe: 'response' });
    else return this.http.post(environment.apiUrl + '/admin/catchmentArea/' + id, payload, { observe: 'response' });
  }
  get(id): Observable<any> {
    return this.http.get(environment.apiUrl + '/admin/catchmentArea/' + id);
  }

  getAll(pageNumber, pageSize): Observable<any> {
    let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
    return this.http.get(environment.apiUrl + '/admin/catchmentArea', { params });
  }

  getPostcodes(term): Observable<any> {
    return this.http.get(environment.apiUrl + '/admin/catchmentArea/search/postcode/?p=' + term);
  }

  getArea(id): Observable<any> {
    return this.http.get(environment.apiUrl + '/admin/catchmentArea/' + id + '/area');
  }

  getDeliveryCharges(id, pageNumber, pageSize): Observable<any> {
    let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
    return this.http.get(environment.apiUrl + '/admin/catchmentArea/deliveryCharges/' + id, { params });
  }

  createDeliveryCharge(id, data) {
    return this.http.post(environment.apiUrl + '/admin/catchmentArea/deliveryCharges/' + id, data, { observe: 'response' });
  }

}
