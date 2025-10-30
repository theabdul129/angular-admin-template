
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {
  constructor(private http: HttpClient) {
  }

  register(registerUser): Observable<any> {
    return this.http.put(environment.apiUrl + '/dispatch/routes', registerUser, { observe: 'response' });
  }

  update(updateUser, id): Observable<any> {
    return this.http.post(environment.apiUrl + '/dispatch/routes/' + id, updateUser, { observe: 'response' });
  }

  getRoutes(startDate, endDate, couriers, pageNumber, pageSize): Observable<any> {
    let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
    if (startDate && endDate) params = params.append('startDate', startDate).append('endDate', endDate);
    if (couriers) params = params.append('couriers', couriers);
    return this.http.get(environment.apiUrl + '/dispatch/routes', { params });
  }

  get(id) {
    return this.http.get(environment.apiUrl + '/dispatch/routes/' + id);
  }

}
