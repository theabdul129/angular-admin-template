import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root"
})
export class SearchService {
  constructor(private http: HttpClient) {}

  searchPostcodes(postcode): Observable<any> {
    return this.http.get(
      environment.apiUrl + "/search/postcode/?p=" + postcode
    );
  }

  searchAddresses(address): Observable<any> {
    return this.http.get(
      environment.apiUrl + "/search/address?address=" + address
    );
  }
  searchCustomers(query): Observable<any> {
    return this.http.post(environment.apiUrl + "/search/customers/", query, {
      observe: "response"
    });
  }
  searchStores(query): Observable<any> {
    return this.http.post(environment.apiUrl + "/search/stores/", query, {
      observe: "response"
    });
  }

  searchCouriers(query): Observable<any> {
    return this.http.post(environment.apiUrl + "/search/couriers/", query, {
      observe: "response"
    });
  }

  searchProducts(query): Observable<any> {
    return this.http.post(environment.apiUrl + "/products/search/", query);
  }
  searchProductsOnlyLive(query): Observable<any> {

    let params = new HttpParams().append('onlyLive',true);
   
    return this.http.post(environment.apiUrl + "/products/search/", query,{'params' : params});
  }

  searchCountries(query): Observable<any> {
    return this.http.get(environment.apiUrl + "/search/countries/?p=" + query);
  }

  searchProductCategories(query): Observable<any> {
    return this.http.get(
      environment.apiUrl + "/search/categories/?p=" + query
    );
  }
  
  searchProductTags(query): Observable<any> {
    return this.http.get(
      environment.apiUrl + "/search/tags/?p=" + query
    );
  }
  
  searchProductBrands(query): Observable<any> {
    return this.http.get(
      environment.apiUrl + "/search/brands/?p=" + query
    );
  }

  searchCatchmentArea(query): Observable<any> {
    return this.http.get(
      environment.apiUrl + "/search/catchmentAreas/?p=" + query
    );
  }

  searchBusinessAccounts(data): Observable<any> {
    return this.http.post(environment.apiUrl + "/search/businessAccounts", data);
  }
  
  // here i need to add search api for search addresses
  searchCustomerAddresses(customerId,pageSize?,page?){
    let url=`${environment.apiUrl}/customers/${customerId}/addresses`;
    return this.http.get(url);
  }

}
