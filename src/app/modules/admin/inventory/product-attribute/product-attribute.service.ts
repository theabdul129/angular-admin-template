import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductAttributeService {

    constructor(private http: HttpClient) { }

    productAttributes(pageNumber, pageSize): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + '/attributes/', { params });
    }

    createProductAttribute(payload): Observable<any> {
        return this.http.put<any>(
            environment.apiUrl + '/attributes/',
            payload,
            { observe: 'response' }
        );
    }

    updateProductAttribute(payload, id): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + '/attributes/' + id,
            payload,
            { observe: 'response' }
        );
    }

    archiveProductAttribute(id): Observable<any> {
        return this.http.delete(environment.apiUrl + '/attributes/' + id, {
            observe: 'response'
        });
    }

}