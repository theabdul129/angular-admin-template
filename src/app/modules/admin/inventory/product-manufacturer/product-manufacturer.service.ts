import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pager } from 'app/models/pager';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductManufacturerService {
    constructor(private http: HttpClient) { }

    getAll(pageNumber, pageSize): Observable<Pager<any>> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get<Pager<any>>(
            environment.apiUrl + '/productManufacturers', { params }
        );
    }

    get(id): Observable<any> {
        return this.http.get(environment.apiUrl + '/productManufacturers/' + id);
    }

    delete(id): Observable<any> {
        return this.http.delete(environment.apiUrl + '/productManufacturers/' + id, { observe: 'response' });
    }

    create(data): Observable<any> {
        return this.http.put(environment.apiUrl + '/productManufacturers/', data, { observe: 'response' });
    }

    update(id, data): Observable<any> {
        return this.http.post(environment.apiUrl + '/productManufacturers/' + id, data, { observe: 'response' });
    }
}
