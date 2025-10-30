import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductTypeService {

    constructor(private http: HttpClient) { }

    allProductAttributes(pageNumber, pageSize): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + '/attributes', { params });
    }

    productAttributes(pageNumber, pageSize, id): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + '/products/attributes/' + id, { params });
    }

    productTypes(pageNumber, pageSize): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + '/productTypes', { params });
    }

    createProductTypes(payload): Observable<any> {
        return this.http.put<any>(
            environment.apiUrl + '/productTypes/',
            payload,
            { observe: 'response' }
        );
    }

    updateProductTypes(payload, id): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + '/productTypes/' + id,
            payload,
            { observe: 'response' }
        );
    }

    getProductType(id): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + '/productTypes/' + id
        );
    }

    createAttribute(payload, id): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + '/productTypes/' + id + '/attributes',
            payload,
            { observe: 'response' }
        );
    }

    updateAttribute(payload, id, attributeId): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + '/products/attributes/' + id + '/' + attributeId,
            payload,
            { observe: 'response' }
        );
    }

}