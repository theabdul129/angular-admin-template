
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Courier } from 'app/models/courier';

@Injectable({
  providedIn: 'root'
})
export class CourierService {
  constructor(private http: HttpClient) {
  }

  register(registerUser): Observable<any> {
    return this.http.put(environment.apiUrl + '/admin/register/courier/', registerUser, { observe: 'response' });
  }

  update(updateUser, id): Observable<any> {
    return this.http.post(environment.apiUrl + '/admin/couriers/' + id, updateUser, { observe: 'response' });
  }

  me(): Observable<Courier> {
    return this.http.get<Courier>(environment.apiUrl + '/couriers/me');
  }

  get(id): Observable<any> {
    return this.http.get(environment.apiUrl + '/admin/couriers/' + id);
  }

  getAll(pageNumber, pageSize): Observable<any> {
    let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
    return this.http.get(environment.apiUrl + '/admin/couriers', { params });
  }

  getCalendar(start, end, id): Observable<any> {
    return this.http.get(environment.apiUrl + '/couriers/' + id + '/calendar/' + start + "/" + end, { observe: 'response' });
  }


  saveCalendarBlock(calendarBlock, id): Observable<any> {
    return this.http.post(environment.apiUrl + '/couriers/' + id + '/calendar/' + calendarBlock.id, calendarBlock, { observe: 'response' });
  }
  archiveCalendarBlock(calendarBlockId, id): Observable<any> {
    return this.http.delete(environment.apiUrl + '/couriers/' + id + '/calendar/' + calendarBlockId, { observe: 'response' });
  }

  getRoutes(startDate, id, pageNumber, pageSize): Observable<any> {
    let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize).append('active', false);
    if (startDate) params = params.append('startDate', startDate);
    return this.http.get(environment.apiUrl + '/couriers/routes/' + id, { params });
  }

  approveCourier(id): Observable<any> {
    return this.http.post(environment.apiUrl + '/admin/couriers/' + id + '/approve', { observe: 'response' });
  }

  disableCourier(id): Observable<any> {
    return this.http.post(environment.apiUrl + '/admin/couriers/' + id + '/disable', { observe: 'response' });
  }

  archiveCourier(id): Observable<any> {
    return this.http.post(environment.apiUrl + '/couriers/' + id, { observe: 'response' });
  }


  verifyCourier(payload): Observable<any> {
    return this.http.post(environment.apiUrl + '/couriers/verify/badge', payload, { observe: 'response' });
  }

  saveProfileImage(payload, id): Observable<any> {
    return this.http.post(environment.apiUrl + '/couriers/' + id + '/media/profile/', payload, { observe: 'response' })
  }

  reprocessApplication(id): Observable<any> {
    return this.http.post(environment.apiUrl + '/admin/couriers/applications/' + id, {}, { observe: 'response' })
  }

}
