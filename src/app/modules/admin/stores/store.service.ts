
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    constructor(private http: HttpClient) { }

    getStores(pageNumber, pageSize): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + '/stores', { params });
    }

    storeDetail(id): Observable<any> {
        return this.http.get(environment.apiUrl + '/stores/' + id);
    }

    updateStore(updateUser, id): Observable<any> {
        return this.http.post(environment.apiUrl + '/stores/' + id, updateUser, { observe: 'response' });
    }

    createStore(registerUser): Observable<any> {
        return this.http.put(environment.apiUrl + '/stores',registerUser, { observe: 'response' });
    }

    contact(payload): Observable<any> {
        return this.http.put(environment.apiUrl + "/support/contact/", payload, { observe: "response" });
    }


    getAllByBusinessAccount(businessAccountId, page): Observable<any> {
        return this.http.get(environment.apiUrl + '/stores/?page=' + page + '&businessAccountId=' + businessAccountId);
    }

    approveStore(id): Observable<any> {
        return this.http.post(environment.apiUrl + '/stores/' + id + '/approve', {}, { observe: 'response' });
    }

    disableStore(id): Observable<any> {
        return this.http.delete(environment.apiUrl + '/stores/' + id + '/disable', { observe: 'response' });
    }

    archiveStore(id): Observable<any> {
        return this.http.delete(environment.apiUrl + '/stores/' + id);
    }

    changeEnvironment(payload, id): Observable<any> {
        return this.http.post(environment.apiUrl + '/stores/' + id + '/environment', payload, { observe: 'response' });
    }

    getAllPrivileges(): Observable<any> {
        return this.http.get(environment.apiUrl + "/store/Collaborators/");
    }

    getWorkingTimes(start, end, id): Observable<any> {
        if (start && !end) return this.http.get(environment.apiUrl + '/store/openingTimes/' + id + '/' + start, { observe: 'response' });
        else return this.http.get(environment.apiUrl + '/store/openingTimes/' + id + '/' + start + "/" + end, { observe: 'response' });
    }

    getApiKey(payload, storeId): Observable<any> {
        return this.http.post(environment.apiUrl + '/store/ApiAccess/' + storeId, payload, { observe: 'response' });
    }

    getStocks(id, pageNumber, pageSize): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + '/store/stock/adjustment/' + id, { params });
    }

    updateStock(storeId, id, data) {
        return this.http.post(environment.apiUrl + '/store/stock/adjustment/' + storeId + '/' + id, data, { observe: 'response' });
    }

    deleteStock(storeId, id, data): Observable<any> {
        return this.http.delete(environment.apiUrl + '/store/stock/adjustment/' + storeId + '/' + id, { body: data, observe: 'response' });
    }

    saveCalendarBlock(calendarBlock, storeId, id): Observable<any> {
        return this.http.post(environment.apiUrl + '/store/openingTimes/' + storeId + '/' + id, calendarBlock, { observe: 'response' });
    }

    deleteCalendarBlock(storeId, id): Observable<any> {
        return this.http.delete(environment.apiUrl + '/store/openingTimes/' + storeId + '/' + id, { observe: 'response' });
    }

    getStoreStock(storeId, productId, pageNumber, pageSize): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize).append('productId', productId).append('storeId', storeId);
        return this.http.get(environment.apiUrl + '/store/stock', { params });
    }

    lowStocks(storeId, pageNumber, pageSize): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + '/store/inventory/'+storeId+'/lowStock', { params });
    }

}
