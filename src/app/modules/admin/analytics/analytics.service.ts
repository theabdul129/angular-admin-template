
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    constructor(private http: HttpClient) {
    }

    orderSale(startDate, endDate, reportPeriod, catchmentAreas, products, categories, stores): Observable<any> {
        let params = new HttpParams().append('reportPeriod', reportPeriod);
        if (startDate) params = params.append('startAt', startDate);
        if (startDate && endDate) params = params.append('endAt', endDate);
        if (catchmentAreas) params = params.append('catchmentAreas', catchmentAreas);
        if (products) params = params.append('products', products);
        if (categories) params = params.append('categories', categories);
        if (stores) params = params.append('stores', stores);
        return this.http.get(environment.apiUrl + '/admin/reports/orders', { params });
    }

    productSale(startDate, endDate, reportPeriod, catchmentAreas, products, categories, stores): Observable<any> {
        let params = new HttpParams().append('reportPeriod', reportPeriod);
        if (startDate) params = params.append('startAt', startDate);
        if (startDate && endDate) params = params.append('endAt', endDate);
        if (catchmentAreas) params = params.append('catchmentAreas', catchmentAreas);
        if (products) params = params.append('products', products);
        if (categories) params = params.append('categories', categories);
        if (stores) params = params.append('stores', stores);
        return this.http.get(environment.apiUrl + '/admin/reports/orders/products', { params });
    }

    categoriesSale(startDate, endDate, reportPeriod, catchmentAreas, products, categories, stores): Observable<any> {
        let params = new HttpParams().append('reportPeriod', reportPeriod);
        if (startDate && endDate) params = params.append('endAt', endDate);
        if (catchmentAreas) params = params.append('catchmentAreas', catchmentAreas);
        if (products) params = params.append('products', products);
        if (categories) params = params.append('categories', categories);
        if (stores) params = params.append('stores', stores);
        if (startDate) params = params.append('startAt', startDate);
        return this.http.get(environment.apiUrl + '/admin/reports/orders/categories', { params });
    }

    generateReport(type, startDate, endDate, reportPeriod, catchmentAreas, products, categories, stores) {
        let params = new HttpParams().append('reportPeriod', reportPeriod);
        if (startDate && endDate) params = params.append('endAt', endDate);
        if (catchmentAreas) params = params.append('catchmentAreas', catchmentAreas);
        if (products) params = params.append('products', products);
        if (categories) params = params.append('categories', categories);
        if (stores) params = params.append('stores', stores);
        if (startDate) params = params.append('startAt', startDate);
        if (type) return this.http.get(environment.apiUrl + '/admin/reports/orders/' + type + '/exportCSV', { params })
        else return this.http.get(environment.apiUrl + '/admin/reports/orders/exportCSV', { params })
    }

}
