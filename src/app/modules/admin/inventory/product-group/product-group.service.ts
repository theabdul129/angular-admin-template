import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pager } from 'app/models/pager';
import { ProductGroup } from 'app/models/productgroup';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductGroupService {
    constructor(private http: HttpClient) { }

    getAll(pageNumber, pageSize): Observable<Pager<ProductGroup>> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get<Pager<ProductGroup>>(
            environment.apiUrl + '/admin/productGroups/?showArchived=false', { params }
        );
    }

    save(product, id): Observable<any> {
        if (id) {
            return this.http.post<ProductGroup>(
                environment.apiUrl + '/admin/productGroups/' + id,
                product,
                { observe: 'response' }
            );
        } else {
            return this.http.put<ProductGroup>(
                environment.apiUrl + '/admin/productGroups/',
                product,
                { observe: 'response' }
            );
        }
    }



    get(id): Observable<ProductGroup> {
        return this.http.get<ProductGroup>(
            environment.apiUrl + '/admin/productGroups/' + id
        );
    }

    getAllByProductGroup(type, customerId): Observable<any[]> {
        return this.http.get<ProductGroup[]>(
            environment.apiUrl +
            '/admin/admin/productGroups/?categories=' +
            type +
            '&customerId=' +
            customerId
        );
    }

    archive(id): Observable<any> {
        return this.http.delete(environment.apiUrl + '/admin/productGroups/' + id, { observe: 'response' });
    }

    removeProduct(productId, id): Observable<any> {
        return this.http.delete<ProductGroup>(environment.apiUrl + '/admin/productGroups/' + id + "/product/" + productId, { observe: 'response' });
    }

    addProduct(product, id): Observable<any> {
        return this.http.put<ProductGroup>(environment.apiUrl + '/admin/productGroups/' + id + "/product", product, { observe: 'response' });
    }

    approveProductGroup(id): Observable<any> {
        return this.http.post(environment.apiUrl + '/admin/productGroups/' + id + '/approve', {}, { observe: 'response' });
    }

    disableProductGroup(id): Observable<any> {
        return this.http.delete(environment.apiUrl + '/admin/productGroups/' + id + '/disable', { observe: 'response' });
    }
}
