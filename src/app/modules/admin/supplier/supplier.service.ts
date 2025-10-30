
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SuppliersService {

    constructor(private http: HttpClient) {
    }

    getAll(pageNumber, pageSize): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + '/suppliers', { params });
    }

    get(id): Observable<any> {
        return this.http.get(environment.apiUrl + '/suppliers/' + id);
    }

    create(data) {
        return this.http.put(environment.apiUrl + '/suppliers', data, { observe: 'response' });
    }

    update(id, data) {
        return this.http.post(environment.apiUrl + '/suppliers/' + id, data, { observe: 'response' });
    }

    delete(id) {
        return this.http.delete(environment.apiUrl + '/suppliers/' + id + '/archive', { observe: 'response' });
    }

    getTerms(id, pageNumber, pageSize): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + '/suppliers/' + id + '/terms', { params });
    }

    createTerm(id, data) {
        return this.http.put(environment.apiUrl + '/suppliers/' + id + '/terms', data, { observe: 'response' });
    }

    updateTerm(supplierId, termId, data) {
        return this.http.post(environment.apiUrl + '/suppliers/' + supplierId + '/terms/' + termId, data, { observe: 'response' });
    }

    deleteTerm(supplierId, termId) {
        return this.http.delete(environment.apiUrl + '/suppliers/' + supplierId + '/terms/' + termId, { observe: 'response' });
    }

    getDeliveryTerms(supplierId, termId, pageNumber, pageSize): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + '/suppliers/' + supplierId + '/terms/' + termId + '/deliveryTerms', { params });
    }

    createDeliveryTerm(supplierId, termId, data) {
        return this.http.put(environment.apiUrl + '/suppliers/' + supplierId + '/terms/' + termId + '/deliveryTerms', data, { observe: 'response' });
    }

    updateDeliveryTerm(supplierId, termId, id, data) {
        return this.http.post(environment.apiUrl + '/suppliers/' + supplierId + '/terms/' + termId + '/deliveryTerms/' + id, data, { observe: 'response' });
    }

    getProducts(id, pageNumber, pageSize) {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + '/suppliers/products/' + id, { params });
    }

    addProduct(id, data) {
        return this.http.put(environment.apiUrl + '/suppliers/products/' + id, data, { observe: 'response' });
    }

    purchaseOrders(pageNumber, pageSize) {
        let params = new HttpParams().append('page', pageNumber)
        .append('pageSize', pageSize);
        return this.http.get(`${environment.apiUrl}/suppliers/purchaseOrders`, { params });
    }

    addPurchaseOrder(data) {
        return this.http.put(`${environment.apiUrl}/suppliers/purchaseOrders`, data, { observe: 'response' });
    }

    getPurchaseOrder(id) {
        return this.http.get(`${environment.apiUrl}/suppliers/purchaseOrders/${id}`);
    }

    getPurchaseProducts(id, pageNumber, pageSize) {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(`${environment.apiUrl}/suppliers/purchaseOrders/${id}/products`, {params});
    }

    updatePurchaseOrder(id, data) {
        return this.http.post(`${environment.apiUrl}/suppliers/purchaseOrders/${id}`, data, { observe: 'response' });
    }

    deletePurchaseOrder(id) {
        return this.http.delete(`${environment.apiUrl}/suppliers/purchaseOrders/${id}`, { observe: 'response' });
    }

    getPrices(id, pageNumber, pageSize) {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(`${environment.apiUrl}/suppliers/products/${id}/prices`, { params });
    }

    addPrice(id, data) {
        return this.http.put(`${environment.apiUrl}/suppliers/products/${id}/prices`, data, { observe: 'response' });
    }

    updatePrice(id, priceId, data) {
        return this.http.post(`${environment.apiUrl}/suppliers/products/${id}/prices/${priceId}`, data, { observe: 'response' });
    }

    addPurchaseProduct(id, data) {
        return this.http.put(`${environment.apiUrl}/suppliers/purchaseOrders/${id}/products`, data, { observe: 'response' });
    }

    updatePurchaseProduct(id, productId, data) {
        return this.http.post(`${environment.apiUrl}/suppliers/purchaseOrders/${id}/products/${productId}`, data, { observe: 'response' });
    }

    removePurchaseProduct(id, productId) {
        return this.http.delete(`${environment.apiUrl}/suppliers/purchaseOrders/${id}/products/${productId}`, { observe: 'response' });
    }

    generateOrder(id) {
        return this.http.get(`${environment.apiUrl}/suppliers/purchaseOrders/${id}/view`);
    }

    getContacts(id, pageNumber, pageSize) {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(`${environment.apiUrl}/suppliers/${id}/contacts`, { params });
    }

    addContact(id, data) {
        return this.http.post(`${environment.apiUrl}/suppliers/${id}/contacts`, data, { observe: 'response' });
    }

    updateContact(supplierId, id, data) {
        return this.http.post(`${environment.apiUrl}/suppliers/${supplierId}/contacts/${id}`, data, { observe: 'response' });
    }

    deleteContact(supplierId, id) {
        return this.http.delete(`${environment.apiUrl}/suppliers/${supplierId}/contacts/${id}`, { observe: 'response' });
    }

    deliverOrder(id) {
        return this.http.post(`${environment.apiUrl}/suppliers/purchaseOrders/${id}/delivered`, {}, { observe: 'response' });
    }

    completeOrder(id) {
        return this.http.post(`${environment.apiUrl}/suppliers/purchaseOrders/${id}/complete`, {}, { observe: 'response' });
    }
}
