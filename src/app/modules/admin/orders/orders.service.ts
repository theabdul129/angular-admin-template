
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrdersService {
    constructor(private http: HttpClient) {
    }

    get(id): Observable<any> {
        return this.http.get(environment.apiUrl + '/orders/' + id);
    }

    getAll(pageNumber, pageSize, start, end, status): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        if(start) params = params.append('startAt', start);
        if(end) params = params.append('endAt', end);
        if(status) params = params.append('orderFilter', status);
        return this.http.get(environment.apiUrl + '/orders', { params });
    }

}
