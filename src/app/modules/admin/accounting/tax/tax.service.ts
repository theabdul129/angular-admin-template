
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TaxService {

    constructor(private http: HttpClient) {
    }

    getAll(pageNumber, pageSize): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + '/accounting/tax', { params });
    }

    get(id): Observable<any> {
        return this.http.get(environment.apiUrl + '/accounting/tax/' + id);
    }

    create(data) {
        return this.http.put(environment.apiUrl + '/accounting/tax/', data, { observe: 'response' });
    }

    update(id, data) {
        return this.http.post(environment.apiUrl + '/accounting/tax/' + id, data, { observe: 'response' });
    }
}
