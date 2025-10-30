
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {
    constructor(private http: HttpClient) {
    }

    save(payload): Observable<any> {
        return this.http.put(environment.apiUrl + '/admin/system/settings', payload, { observe: 'response' });
    }

    getAll(pageNumber, pageSize): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + '/admin/system/settings', { params });
    }

}
