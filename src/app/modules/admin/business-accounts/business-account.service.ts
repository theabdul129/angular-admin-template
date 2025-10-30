import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BusinessAccountService {
    constructor(private http: HttpClient) { }

    getAllByBusinessAccount(pageNumber, pageSize, id): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize).append('businessAccountId', id);
        return this.http.get(environment.apiUrl + '/stores', { params });
    }

    getBusinessAccounts(pageNumber, pageSize): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + '/businessAccounts', { params });
    }

    getBusinessAccount(): Observable<any> {
        return this.http.get(environment.apiUrl + '/businessAccounts');
    }

    getBusinessBankAccount(): Observable<any> {
        return this.http.get(environment.apiUrl + '/businessAccounts/bank-account');
    }

    saveBusinessBankAccount(data): Observable<any> {
        return this.http.put(environment.apiUrl + '/businessAccounts/bank-account',data);
    }

    archive(id): Observable<any> {
        return this.http.delete(environment.apiUrl + '/businessAccounts/' + id + '/archive', { observe: 'response' });
    }

    approve(id): Observable<any> {
        return this.http.post(environment.apiUrl + '/businessAccounts/' + id + '/approve', {}, { observe: 'response' });
    }

    disable(id): Observable<any> {
        return this.http.delete(environment.apiUrl + '/businessAccounts/' + id + '/disable', { observe: 'response' });
    }x

    getAllCollaborators(pageNumber, pageSize): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + "/businessAccounts/collaborators", { params });
    }

    inviteUser(inviteUser): Observable<any> {
        return this.http.post(environment.apiUrl + "/businessAccounts/collaborators/invitations" , inviteUser, { observe: "response" });
    }    

    addBusinessAccount(data): Observable<any> {
        return this.http.put(environment.apiUrl + '/businessAccounts', data,  { observe: "response" });
    }

    saveBusinessAccount(data): Observable<any> {
        return this.http.post(environment.apiUrl + '/businessAccounts', data,  { observe: "response" });
    }

    searchCollaborators(search): Observable<any> {
        return this.http.get(environment.apiUrl + "/businessAccounts/collaborators/?page=" + 0 + "&s=" + search);
    }

    update(payload, storeCollaboratorId): Observable<any> {
        return this.http.post(environment.apiUrl + "/businessAccounts/collaborators/" + storeCollaboratorId, payload, { observe: "response" });
    }

    getAllPrivileges(): Observable<any> {
        return this.http.get(environment.apiUrl + "/system/security/scopes");
    }

    generateImageUrl(id): Observable<any> {
        return this.http.get(
            environment.apiUrl + "/businessAccounts/generateUrl"
        );
    }

    allDocuments(pageNumber, pageSize) {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + "/businessAccounts/documents", { params });
    }

    addDocument(data): Observable<any> {
        return this.http.post(environment.apiUrl + '/businessAccounts/documents', data, { observe: "response" });
    }

    deleteDocument(doc): Observable<any> {
        return this.http.delete(environment.apiUrl + '/businessAccounts/documents/?documentType=' + doc + '', { observe: 'response' });
    
    }    
    getPayments(pageNumber, pageSize): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + '/businessAccounts/payments', { params });
    }

    addPayment(data): Observable<any> {
        return this.http.post(environment.apiUrl + '/businessAccounts/payments', data, { observe: "response" });
    }

    paymentProviders(): Observable<any> {
        return this.http.get(environment.apiUrl + "/system/paymentProviders");
    }

    getSystemStatus(): Observable<any> {
        return this.http.get(environment.apiUrl + '/system/statuses');
    }

    updateOrderStatus(store, order, data): Observable<any> {
      return this.http.post(environment.apiUrl + '/stores/' + store+ '/orders/' + order+'/status', data, { observe: 'response' });
    }
    getAllLenders(pageNumber, pageSize): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + '/merchants/lenders', { params });
    }

    getPaymentsByBeneficiaryId(id, pageNumber, pageSize): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + `/beneficiaries/${id}/payments`, { params });
    }

    getWebHooksEvents(){
        return this.http.get(`${environment.apiUrl}/system/webhooks/events`)
    }

    saveWebHooks(payload){
        return this.http.post(`${environment.apiUrl}/tenants/webhooks`,payload);
    }

    getWebHooks(env){
        return this.http.get(`${environment.apiUrl}/tenants/webhooks/${env}`)
    }
    
    addReferenceNumber(orderNumber,payload){
        return this.http.post(`${environment.apiUrl}/orders/${orderNumber}/externalReference`,payload)
    }

}
