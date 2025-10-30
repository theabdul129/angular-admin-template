import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pager } from 'app/models/pager';
import { PackageDimension } from 'app/models/packagedimension';
import { Product } from 'app/models/product';
import { ProductBrand } from 'app/models/productbrand';
import { ProductCategory } from 'app/models/productcategory';
import { ProductImage } from 'app/models/productimage';
import { environment } from 'environments/environment';
import { CatchmentProductPrice } from 'app/models/catchmentproductprice';
import { CatchmentProductInformation } from 'app/models/catchmentproductinformation';


@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    constructor(private http: HttpClient) { }

    getAll(pageNumber, pageSize): Observable<Pager<Product>> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get<Pager<Product>>(
            environment.apiUrl + '/products', { params }
        );
    }

    getAllActive(pageNumber, pageSize): Observable<Pager<Product>> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize).append('active',true);
        return this.http.get<Pager<Product>>(
            environment.apiUrl + '/products', { params }
        );
    }

    save(product, id): Observable<any> {
        if (id) {
            return this.http.post<Product>(
                environment.apiUrl + '/products/' + id,
                product,
                { observe: 'response' }
            );
        } else {
            return this.http.put<Product>(
                environment.apiUrl + '/products',
                product,
                { observe: 'response' }
            );
        }
    }

    get(id): Observable<Product> {
        return this.http.get<Product>(environment.apiUrl + '/products/' + id);
    }

    getByGtin(gtin): Observable<Product> {
        return this.http.get<Product>(
            environment.apiUrl + '/products/gtin/' + gtin
        );
    }

    getAllByProductCategory(type, customerId): Observable<any[]> {
        return this.http.get<Product[]>(
            environment.apiUrl +
            '/products/?categories=' +
            type +
            '&customerId=' +
            customerId
        );
    }

    deleteProductCategoryBookingPrice(
        bookingPriceId,
        vehicleId,
        id
    ): Observable<any> {
        return this.http.delete(
            environment.apiUrl +
            '/products/' +
            id +
            '/productcategory/' +
            vehicleId +
            '/bookingprice/' +
            bookingPriceId,
            { observe: 'response' }
        );
    }

    saveBookingPrices(bookingPrices, vehicleId, id): Observable<any> {
        return this.http.post(
            environment.apiUrl +
            '/products/' +
            id +
            '/productvehicle/' +
            vehicleId +
            '/bookingprice',
            bookingPrices,
            { observe: 'response' }
        );
    }

    saveProductVehicle(productVehicle, vehicleId, id): Observable<any> {
        return this.http.post(
            environment.apiUrl + '/products/' + id + '/productvehicle/' + vehicleId,
            productVehicle,
            { observe: 'response' }
        );
    }

    addProductCategory(vehicleType, id): Observable<any> {
        return this.http.post(
            environment.apiUrl +
            '/products/' +
            id +
            '/productcategory/' +
            vehicleType,
            vehicleType,
            { observe: 'response' }
        );
    }

    archive(id): Observable<any> {
        return this.http.delete(environment.apiUrl + '/products/' + id, { observe: 'response' });
    }

    productCategories(): Observable<Pager<ProductCategory>> {
        return this.http.get<Pager<ProductCategory>>(
            environment.apiUrl + '/productcategories'
        );
    }

    saveProductCategory(payload, id): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + '/productcategories/' + id,
            payload,
            { observe: 'response' }
        );
    }

    archiveProductCategory(id): Observable<any> {
        return this.http.delete(environment.apiUrl + '/productcategories/' + id, {
            observe: 'response'
        });
    }

    productBrands(): Observable<Pager<ProductBrand>> {
        return this.http.get<Pager<ProductBrand>>(
            environment.apiUrl + '/productBrand'
        );
    }

    saveProductBrand(payload, id): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + '/productBrand/' + id,
            payload,
            { observe: 'response' }
        );
    }

    mergeProduct(payload, id): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + '/products/merge/' + id,
            payload,
            { observe: 'response' }
        );
    }

    archiveProductBrand(id): Observable<any> {
        return this.http.delete(environment.apiUrl + '/productBrand/' + id, {
            observe: 'response'
        });
    }

    addProductImage(payload, id, productId): Observable<any> {
        return this.http.put<any>(
            environment.apiUrl + '/product/image/' + productId,
            payload,
            { observe: 'response' }
        );
    }

    updateProductImage(payload, id, productId): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + '/product/image/' + productId + '/' + id,
            payload,
            { observe: 'response' }
        );
    }

    archiveProductImage(id): Observable<any> {
        return this.http.delete(environment.apiUrl + '/product/image/' + id, {
            observe: 'response'
        });
    }

    productImages(productId): Observable<Pager<ProductImage>> {
        return this.http.get<Pager<ProductImage>>(
            environment.apiUrl + '/product/image/' + productId
        );
    }

    generateProductImageUrl(productId): Observable<any> {
        return this.http.get(
            environment.apiUrl + '/product/image/' + productId + '/generateUrl'
        );
    }



    packageDimensions(productId): Observable<Pager<PackageDimension>> {
        return this.http.get<Pager<PackageDimension>>(
            environment.apiUrl + '/packageDimension/' + productId
        );
    }

    savePackageDimension(payload, id, productId): Observable<any> {
        return this.http.post<any>(
            environment.apiUrl + '/packagedimension/' + productId + '/' + id,
            payload,
            { observe: 'response' }
        );
    }

    archivePackageDimension(id): Observable<any> {
        return this.http.delete(environment.apiUrl + '/packagedimension/' + id, {
            observe: 'response'
        });
    }

    approveProduct(id): Observable<any> {
        return this.http.post(
            environment.apiUrl + '/products/' + id + '/approve', {},
            { observe: 'response' }
        );
    }

    disableProduct(id): Observable<any> {
        return this.http.delete(
            environment.apiUrl + '/products/' + id + '/disable',
            { observe: 'response' }
        );
    }

    addGtin(payload, id): Observable<any> {
        return this.http.post(
            environment.apiUrl + '/products/' + id + '/gtin',
            payload,
            { observe: 'response' }
        );
    }

    removeGtin(gtin, id): Observable<any> {
        return this.http.delete(
            environment.apiUrl + '/products/' + id + '/gtin/' + gtin,
            { observe: 'response' }
        );
    }

    addRelatedProductCategory(payload, id): Observable<any> {
        return this.http.post(
            environment.apiUrl + '/products/' + id + '/related/category',
            payload,
            { observe: 'response' }
        );
    }

    removeRelatedProductCategory(productCategoryId, id): Observable<any> {
        return this.http.delete(
            environment.apiUrl + '/products/' + id + '/related/category/' + productCategoryId,
            { observe: 'response' }
        );
    }

    addProductTag(payload, id): Observable<any> {
        return this.http.post(
            environment.apiUrl + '/products/' + id + '/tag',
            payload,
            { observe: 'response' }
        );
    }

    removeProductTag(productTagId, id): Observable<any> {
        return this.http.delete(
            environment.apiUrl + '/products/' + id + '/tag/' + productTagId,
            { observe: 'response' }
        );
    }


    getAllCatchmentarea(id, pageNumber, pageSize): Observable<Pager<CatchmentProductPrice>> {
        let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
        return this.http.get<Pager<CatchmentProductPrice>>(
            environment.apiUrl + '/catchmentarea/productPrice/' + id, { params }
        );
    }

    saveCatchmentarea(product, id): Observable<any> {
        return this.http.put<CatchmentProductPrice>(
            environment.apiUrl + '/catchmentarea/productPrice/' + id,
            product,
            { observe: 'response' }
        );
    }

    getCatchmentInfo(productId, catchmentAreaId): Observable<CatchmentProductInformation> {
        return this.http.get<CatchmentProductInformation>(
            environment.apiUrl + '/catchmentarea/product/information/' + catchmentAreaId + '/' + productId
        );
    }
    getAttributes(productId): Observable<any> {
        return this.http.get<any>(
            environment.apiUrl + `/products/${productId}/attributes/`);
    }
    saveAttributes(data, productId): Observable<any> {
        return this.http.put<any>(
            environment.apiUrl + `/products/${productId}/attributes/` , data);
    }

    getQR(id): Observable<any> {
        return this.http.get<any>(environment.apiUrl + '/products/qr/' + id, {responseType: 'Blob' as 'json' });
    }
}
