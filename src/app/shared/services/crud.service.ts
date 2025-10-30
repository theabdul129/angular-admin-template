import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "environments/environment";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CrudService {
    private endPoint: string = environment.apiUrl;
    constructor(
        private _http: HttpClient,

    ) {
    }

    buildParams(obj): string {
        let str = '';
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (str !== '') {
                    str += '&';
                }
                str += key + '=' + encodeURIComponent(obj[key]);
            }
        }
        return str;
    }

    index(modelUrl: string, form: any, params = {}): Observable<any[]> {
        return this._http.post<any[]>(`${this.endPoint}${modelUrl}?${this.buildParams(params)}`, form);
    }

    read(modelUrl: string, params = {}): Observable<any> {
        return this._http.get<any>(`${this.endPoint}${modelUrl}?${this.buildParams(params)}`);
    }

    get(modelUrl: string): Observable<any> {
        return this._http.get<any>(`${this.endPoint}${modelUrl}`);
    }

    create(modelUrl: string, form: any): Observable<any> {
        return this._http.post<any>(`${this.endPoint}${modelUrl}`, form);
    }

    post(modelUrl: string, form: any): Observable<any> {
        return this._http.post<any>(`${this.endPoint}${modelUrl}`, form);
    }

    update(modelUrl: string, form: any): Observable<any> {
        return this._http.put<any>(`${this.endPoint}${modelUrl}`, form);
    }

    put(modelUrl: string, form: any): Observable<any> {
        return this._http.put<any>(`${this.endPoint}${modelUrl}`, form);
    }
    patch(modelUrl: string, form: any): Observable<any> {
        return this._http.patch<any>(`${this.endPoint}${modelUrl}`, form);
    }

    delete(modelUrl: string): Observable<any> {
        return this._http.delete<any>(`${this.endPoint}${modelUrl}`);
    }

   
}
