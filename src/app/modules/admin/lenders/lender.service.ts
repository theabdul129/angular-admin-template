import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Lender } from 'app/models/lenders';
import { LenderProduct } from 'app/models/lenderproduct';
import { LenderProductRule } from 'app/models/lenderProductRule';

@Injectable({
    providedIn: 'root',
})
export class LenderService {
    constructor(private http: HttpClient) {}
    me(): Observable<Lender> {
        return this.http.get<Lender>(environment.apiUrl + '/lenders/me');
    }
    save(lender, id): Observable<any> {
        if (id) {
            return this.http.post<Lender>(
                environment.apiUrl + '/lenders/' + id,
                lender,
                { observe: 'response' }
            );
        } else {
            return this.http.put<Lender>(
                environment.apiUrl + '/lenders',
                lender,
                { observe: 'response' }
            );
        }
    }

    savelenderProduct(lenderProduct, lenderId, id): Observable<any> {
        if (id) {
            return this.http.post<LenderProduct>(
                environment.apiUrl + '/lenders/' + lenderId + '/products/' + id,
                lenderProduct,
                { observe: 'response' }
            );
        } else {
            return this.http.put<LenderProduct>(
                environment.apiUrl + '/lenders/' + lenderId + '/products',
                lenderProduct,
                { observe: 'response' }
            );
        }
    }
    savelenderRule(lenderRule, lenderId, productId, id): Observable<any> {
        if (id) {
            return this.http.put<LenderProductRule>(
                environment.apiUrl +
                    '/lenders/' +
                    lenderId +
                    '/products/' +
                    productId +
                    '/rules/' +
                    id,
                lenderRule,
                { observe: 'response' }
            );
        } else {
            return this.http.post<LenderProductRule>(
                environment.apiUrl +
                    '/lenders/' +
                    lenderId +
                    '/products/' +
                    productId +
                    '/rules',
                lenderRule,
                { observe: 'response' }
            );
        }
    }
    getsystemLenders(pageNumber, pageSize): Observable<any> {
        let params = new HttpParams()
            .append('page', pageNumber)
            .append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + '/system/lenders', {
            params,
        });
    }

    getAll(pageNumber, pageSize): Observable<any> {
        let params = new HttpParams()
            .append('page', pageNumber)
            .append('pageSize', pageSize);
        return this.http.get(environment.apiUrl + '/lenders', { params });
    }

    getLenderProduct(id): Observable<any> {
        return this.http.get(
            environment.apiUrl + '/lenders/' + id + '/products'
        );
    }
    getLenderRule(lenderId, productId): Observable<any> {
        return this.http.get(
            environment.apiUrl +
                '/lenders/' +
                lenderId +
                '/products/' +
                productId +
                '/rules'
        );
    }
    deleteLenderRule(lenderId,productId, id): Observable<any> {
      return this.http.delete(
          environment.apiUrl + '/lenders/' + lenderId + '/products/' + productId +'/rules/' + id,
          { observe: 'response' }
      );
  }
    getLenderProductId(lenderId, id): Observable<any> {
        return this.http.get(
            environment.apiUrl + '/lenders/' + lenderId + '/products/' + id
        );
    }
    getLenderRuleId(lenderId,productId, id): Observable<any> {
      return this.http.get(
          environment.apiUrl + '/lenders/' + lenderId + '/products/' + productId +'/rules/' + id
      );
  }
    deleteLenderProduct(lenderId, id): Observable<any> {
        return this.http.delete(
            environment.apiUrl + '/lenders/' + lenderId + '/products/' + id,
            { observe: 'response' }
        );
    }
    addlenderAccount(data): Observable<any> {
        return this.http.put(environment.apiUrl + '/lenders', data, {
            observe: 'response',
        });
    }

    getLender(id): Observable<any> {
        return this.http.get(environment.apiUrl + '/lenders/' + id);
    }

    deleteLender(id): Observable<any> {
        return this.http.delete(environment.apiUrl + '/lenders/' + id, {
            observe: 'response',
        });
    }
}
