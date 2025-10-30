import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root"
})
export class StoreInventoryService {
  constructor(private http: HttpClient) {}

  getAll(storeId, filterInventory, pageNumber, pageSize): Observable<any> {
    let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize).append('filter', filterInventory);
    return this.http.get(
      environment.apiUrl +
        "/store/inventory/" +
        storeId, {params}
    );
  }

  addProduct(payload, storeId): Observable<any> {
    return this.http.put(
      environment.apiUrl + "/store/inventory/" + storeId + "/",
      payload,
      { observe: "response" }
    );
  }

  saveProduct(payload, storeId): Observable<any> {
    return this.http.post(
      environment.apiUrl + "/store/inventory/" + storeId + "/products/",
      payload,
      { observe: "response" }
    );
  }
  saveInventory(payload, storeId): Observable<any> {
    return this.http.post(
      environment.apiUrl + "/store/inventory/" + storeId,
      payload,
      { observe: "response" }
    );
  }

  addProductFile(payload, storeId): Observable<any> {
    return this.http.post(
      environment.apiUrl + "/store/inventory/" + storeId + "/productFile/",
      payload,
      { observe: "response" }
    );
  }

  approvePrice(priceId): Observable<any> {
    return this.http.post(
      environment.apiUrl + "/store/inventory/" + priceId + "/approve",
      {},
      { observe: "response" }
    );
  }

  unapprovedPrice(priceId): Observable<any> {
    return this.http.post(
      environment.apiUrl + "/store/inventory/" + priceId + "/unapprove",
      {},
      { observe: "response" }
    );
  }
}
