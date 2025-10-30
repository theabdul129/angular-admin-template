
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Customer } from 'app/models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) {
  }

  me(): Observable<Customer> {
    return this.http.get<Customer>(environment.apiUrl + '/customers/me');
  }

  get(id): Observable<any> {
    return this.http.get(environment.apiUrl + '/customers/' + id);
  }

  getAll(pageNumber, pageSize): Observable<any> {
    let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
    return this.http.get(environment.apiUrl + '/customers', { params });
  }

  register(registerUser): Observable<any> {
    return this.http.put(environment.apiUrl + '/customers', registerUser, { observe: 'response' });
  }

  update(customer, id): Observable<any> {
    if (id == undefined) {
      return this.register(customer);
    }
    return this.http.post(environment.apiUrl + '/customers/' + id, customer, { observe: 'response' });
  }

  getBookings(id): Observable<any> {
    return this.http.get(environment.apiUrl + '/customers/' + id);
  }

  addDeliveryAddress(customer, data) {
    return this.http.put(`${environment.apiUrl}/customers/${customer}/addresses`, data, { observe: 'response' });
  }

  updateDeliveryAddress(customer, id, data) {
    return this.http.post(`${environment.apiUrl}/customers/${customer}/addresses/${id}`, data, { observe: 'response' });
  }

  deleteDeliveryAddress(customer, id) {
    return this.http.delete(`${environment.apiUrl}/customers/${customer}/addresses/${id}`, { observe: 'response' });
  }

  getOrders(id, pageNumber, pageSize) {
    let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
    return this.http.get(`${environment.apiUrl}/customers/${id}/orders`, { params });
  }

  orderDetail(id) {
    return this.http.get(environment.apiUrl + '/orders/' + id);
  }

  cancelOrder(id, data,customerId): Observable<any> {
    return this.http.delete(environment.apiUrl + `/customers/${customerId}/orders/` + id, { body: data, observe: 'response' });
  }

  refundOrder(orderId, id, data): Observable<any> {
    return this.http.delete(environment.apiUrl + '/orders/' + orderId + '/refund/' + id, { body: data, observe: 'response' });
  }

  getBasket(id): Observable<any> {
    return this.http.get(environment.apiUrl + '/customers/' + id + '/baskets');
  }

  addProduct(id, data, isDisable): Observable<any> {
    if(!isDisable) return this.http.put(environment.apiUrl + '/customers/' + id + '/baskets/product', data, { observe: 'response' });
    else return this.http.post(environment.apiUrl + '/customers/' + id + '/baskets/product/'+data.product.id, data, { observe: 'response' });
  }

  deleteProduct(customer, id) {
    return this.http.delete(`${environment.apiUrl}/customers/${customer}/baskets/product/${id}`, { observe: 'response' });
  }

  getCoupons(id, pageNumber, pageSize): Observable<any> {
    let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
    return this.http.get(environment.apiUrl + '/customers/' + id + '/coupons', { params });
  }

  addCoupon(id, data): Observable<any> {
    return this.http.put(environment.apiUrl + '/customers/' + id+ '/coupons', data, { observe: 'response' });
  }

  deleteCoupon(id, couponId): Observable<any> {
    return this.http.delete(environment.apiUrl + '/customers/' + id+ '/coupons/' + couponId, { observe: 'response' });
  }

  completeBasket(customer, basket) {
    return this.http.post(`${environment.apiUrl}/customers/${customer}/baskets/complete/${basket}`, {}, { observe: 'response' });
  }

  addCouponBasket(customer, couponId) {
    return this.http.post(`${environment.apiUrl}/customers/${customer}/baskets/coupons/${couponId}`, {}, { observe: 'response' });
  }

  getCustomerAddresses(customerId,pageSize,page){
    let url=`${environment.apiUrl}/customers/${customerId}/addresses?pageSize=${pageSize}&page=${page}`;
    return this.http.get(url);
  }

  addShipingAddress(customerId,data){
    let url=`${environment.apiUrl}/customers/${customerId}/baskets/deliveryAddress`
    return this.http.post(url,data, { observe: 'response' });
  }

  addBillingAddress(customerId,data){
    let url=`${environment.apiUrl}/customers/${customerId}/baskets/billingAddress`
    return this.http.post(url,data, { observe: 'response' });
  }

  addOrdersShipingAddress(accountNumber,orderId,data){
    let url=`${environment.apiUrl}/customers/${accountNumber}/orders/${orderId}/deliveryAddress`
    return this.http.post(url,data, { observe: 'response' });
  }

  addOrdersBillinggAddress(accountNumber,orderId,data){
    let url=`${environment.apiUrl}/customers/${accountNumber}/orders/${orderId}/billingAddress`
    return this.http.post(url,data, { observe: 'response' });
  }

  basketSendNotificationMethod(payload,accountNumber){
    let url=`${environment.apiUrl}/customers/${accountNumber}/orders/contact`
    return this.http.put(url,payload, { observe: 'response' });
  }

  customerSendNotificationMethod(payload,accountNumber){
    let url=`${environment.apiUrl}/users/${accountNumber}/contact`
    return this.http.put(url,payload, { observe: 'response' });
  }

getOrderStatus(orderId) {
    return this.http.get(environment.apiUrl + `/orders/statuses/${orderId}`);
}

getAffordability(id): Observable<any> {
  return this.http.get(environment.apiUrl + "/customers/affordability/decisions/" + id);
}

retrieveDiscoveryByCustomerId(customerId){
  return this.http.get(environment.analyticsUrl+"/retrieve_discovery/"+customerId);
} 

retrieveCustomerInsights(customerId){
  return this.http.get(environment.analyticsUrl+"/customer/"+customerId+"/insight");
} 


retrieveCustomerSequence(accountNumber){
  return this.http.get(environment.analyticsUrl+"/retrieve_sequence/"+accountNumber);
} 
  
}
