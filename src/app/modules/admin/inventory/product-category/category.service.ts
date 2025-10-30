import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Pager } from "app/models/pager";
import { ProductCategory } from "app/models/productcategory";
import { ProductImage } from "app/models/productimage";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root"
})
export class ProductCategoryService {
  constructor(private http: HttpClient) {}

  getAll(pageNumber, pageSize): Observable<Pager<ProductCategory>> {
    let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
    return this.http.get<Pager<ProductCategory>>(
      environment.apiUrl + "/productCategories/?showArchived=false", {params}
    );
  }

  save(product, id): Observable<any> {
    if (id) {
      return this.http.post<ProductCategory>(
        environment.apiUrl + "/productCategories/" + id,
        product,
        { observe: "response" }
      );
    } else {
      return this.http.put<ProductCategory>(
        environment.apiUrl + "/productCategories",
        product,
        { observe: "response" }
      );
    }
  }

  childProductCategories(parentProductCategoryId, pageNumber, pageSize): Observable<Pager<ProductCategory>> {
    let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
    return this.http.get<Pager<ProductCategory>>(
      environment.apiUrl + "/productCategories/?parentCategory=" + parentProductCategoryId, {params}
    );
  }

  get(id): Observable<ProductCategory> {
    return this.http.get<ProductCategory>(
      environment.apiUrl + "/productCategories/" + id
    );
  }

  getAllByProductCategory(type, customerId): Observable<any[]> {
    return this.http.get<ProductCategory[]>(
      environment.apiUrl +
        "/products/?categories=" +
        type +
        "&customerId=" +
        customerId
    );
  }

  archive(id): Observable<any> {
    return this.http.delete(environment.apiUrl + "/productCategories/" + id, { observe: "response" });
  }

  saveImage(payload, id, productCategoryId): Observable<any> {
    return this.http.post<any>(
      environment.apiUrl + "/productCategories/image/" + productCategoryId + "/" + id,
      payload,
      { observe: "response" }
    );
  }

  archiveImage(id): Observable<any> {
    return this.http.delete(
      environment.apiUrl + "/productCategories/Image/" + id,
      {
        observe: "response"
      }
    );
  }

  productCategoryImages(productCategoryId): Observable<Pager<ProductImage>> {
    return this.http.get<Pager<ProductImage>>(
      environment.apiUrl + "/productCategories/images/" + productCategoryId
    );
  }

  generateImageUrl(cateoryid): Observable<any> {
    return this.http.get(
      environment.apiUrl + "/productCategories/images/" + cateoryid + "/generateUrl" 
    );
  }

  addProductImage(payload, id): Observable<any> {
    return this.http.put(
      environment.apiUrl + "/productCategories/images/" + id ,
      payload,
      { observe: "response" }
    );
  }

  saveProductImage(payload, id): Observable<any> {
    return this.http.post(
      environment.apiUrl + "/productCategories/images/" + id ,
      payload,
      { observe: "response" }
    );
  }


  approveProductCategory(id): Observable<any> {
    return this.http.post(
      environment.apiUrl + "/productCategories/" + id + "/approve", {},
      { observe: "response" }
    );
  }

  disableProductCategory(id): Observable<any> {
    return this.http.delete(
      environment.apiUrl + "/productCategories/" + id + "/disable",
      { observe: "response" }
    );
  }

  addRelatedProductCategory(payload, id): Observable<any> {
    return this.http.post(
      environment.apiUrl + "/productCategories/" + id + "/related/category",
      payload,
      { observe: "response" }
    );
  }

  removeRelatedProductCategory(productCategoryId, id): Observable<any> {
    return this.http.delete(
      environment.apiUrl +
        "/productCategories/" +
        id +
        "/related/category/" +
        productCategoryId,
      { observe: "response" }
    );
  }
}
