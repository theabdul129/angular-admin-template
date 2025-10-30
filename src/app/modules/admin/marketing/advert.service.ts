import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Advert } from 'app/models/advert';

@Injectable({
    providedIn: 'root',
})
export class AdvertService {
    constructor(private http: HttpClient) {}

    getAll(pageNumber, pageSize): Observable<any> {
        let params = new HttpParams()
            .append('page', pageNumber)
            .append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + '/admin/adverts', { params });
    }

    get(id): Observable<any> {
        return this.http.get(environment.apiUrl + '/admin/adverts/' + id);
    }

    create(data): Observable<any> {
        return this.http.put<Advert>(
            environment.apiUrl + '/admin/adverts',
            data,
            { observe: 'response' }
        );
    }

    save(data, id): Observable<any> {
        return this.http.post<Advert>(
            environment.apiUrl + '/admin/adverts/' + id,
            data,
            { observe: 'response' }
        );
    }

    saveImage(data, id): Observable<any> {
        return this.http.post<Advert>(
            environment.apiUrl + '/admin/adverts/' + id + '/image',
            data,
            { observe: 'response' }
        );
    }


    delete(id) {
        return this.http.delete(
            environment.apiUrl + '/admin/adverts/' + id + '/archive',
            { observe: 'response' }
        );
    }

    generateMediaUrl(productId, mimeType): Observable<any> {
        return this.http.get(
            environment.apiUrl +
                '/admin/adverts/media/' +
                productId +
                '/generateUrl?mimeType=' +
                mimeType
        );
    }

    publish(id): Observable<any> {
        return this.http.post(
            environment.apiUrl + '/admin/adverts/' + id + '/approve',
            { observe: 'response' }
        );
    }

    unpublish(id): Observable<any> {
        return this.http.delete(
            environment.apiUrl + '/admin/adverts/' + id + '/disable',
            { observe: 'response' }
        );
    }
}
