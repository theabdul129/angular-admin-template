import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CommunicationService {

    constructor(private http: HttpClient) { }

    getServices(pageNumber, pageSize): Observable<any> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get(
            environment.apiUrl +
            '/admin/communication/',
            { params, observe: 'response' }
        );
    }

    getServicesBodies(serviceId): Observable<any> {
        return this.http.get(
            environment.apiUrl +
            '/admin/communication/' + serviceId,
            { observe: 'response' }
        );
    }

    saveServiceBody(payload, serviceId, serviceBodyId): Observable<any> {
        return this.http.post(
            environment.apiUrl +
            '/admin/communication/' + serviceId + '/' + serviceBodyId,
            payload,
            { observe: 'response' }
        );
    }

    upload(payload, signedUrl): Observable<any> {
        return this.http.put(
            signedUrl,
            payload, {
            reportProgress: true,
            observe: 'events'
        });
    }

    getUploadUrl(payload): Observable<any> {
        return this.http.post(
            environment.apiUrl + '/media/upload',
            payload,
            { observe: 'response' }
        );
    }


}
