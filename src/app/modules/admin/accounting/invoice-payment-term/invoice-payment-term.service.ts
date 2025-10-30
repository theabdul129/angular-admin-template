
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class InvoicePaymentTermService {

    constructor(private http: HttpClient) {
    }

    getAll(pageNumber, pageSize): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + '/admin/accounting/invoicePaymentTerms', { params });
    }

    get(id): Observable<any> {
        return this.http.get(environment.apiUrl + '/admin/accounting/invoicePaymentTerms/' + id);
    }

    create(data) {
        return this.http.put(environment.apiUrl + '/admin/accounting/invoicePaymentTerms/', data, { observe: 'response' });
    }

    update(id, data) {
        return this.http.post(environment.apiUrl + '/admin/accounting/invoicePaymentTerms/' + id, data, { observe: 'response' });
    }
}
