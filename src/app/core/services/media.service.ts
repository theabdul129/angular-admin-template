import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MediaService {

    constructor(private http: HttpClient) { }

    upload(payload, signedUrl, contentType): Observable<any> {

        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', contentType);
        return this.http.put(
            signedUrl,
            payload, {
            headers: headers,
            reportProgress: true,
            observe: 'events'
        });
    }

    getUploadPublicUrl(payload): Observable<any> {
        return this.http.post(
            environment.apiUrl + '/media/public/upload',
            payload,
            { observe: 'response' }
        );
    }

    generateFileUploadName(generationPath): Observable<any> {
        return this.http.get(
            environment.apiUrl + generationPath,
            { observe: 'response' }
        );
    }


}
