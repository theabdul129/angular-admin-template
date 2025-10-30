
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  get(id): Observable<any> {
    return this.http.get(environment.apiUrl + '/users/' + id);
  }

  getAll(pageNumber, pageSize): Observable<any> {
    let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
    return this.http.get(environment.apiUrl + '/users', {params});
  }

  update(customer, id): Observable<any> {
    return this.http.post(environment.apiUrl + '/users/' + id, customer, { observe: 'response' });
  }

  register(registerUser): Observable<any> {
    return this.http.put(environment.apiUrl + '/register/user', registerUser, { observe: 'response' });

  }

  addRole(userId, data): Observable<any> {
    return this.http.post(environment.apiUrl + '/users/' + userId + '/roles', data, { observe: 'response' });
  }

  getRoles(userId): Observable<any> {
    return this.http.get(environment.apiUrl + '/users/' + userId + '/roles');
  }

  getCollaboratorRoles(collaboratorId): Observable<any> {
    return this.http.get(environment.apiUrl + '/businessAccounts/collaborators/roles/'+collaboratorId);
  }

  addCollaboratorRoles(collaboratorId,payload): Observable<any> {
    return this.http.post(environment.apiUrl + '/businessAccounts/collaborators/roles/'+collaboratorId,payload);
  }

  getAllRoles(): Observable<any> {
    return this.http.get(environment.apiUrl + '/businessAccounts/collaborators/roles/');
  }

  getAllRolesToAdd(): Observable<any> {
    return this.http.get(environment.apiUrl + '/system/security/scopes/roles');
  }

  getCoupons(id, pageNumber, pageSize): Observable<any> {
    let params = new HttpParams().append('page', pageNumber).append('pageSize', pageSize);
    return this.http.get(environment.apiUrl + '/coupons/' + id, { params });
  }

  addCoupon(id, data): Observable<any> {
    return this.http.put(environment.apiUrl + '/coupons/' + id, data, { observe: 'response' });
  }

  deleteCoupon(id): Observable<any> {
    return this.http.delete(environment.apiUrl + '/coupons/' + id, { observe: 'response' });
  }

  getMe(): Observable<any> {
    return this.http.get(environment.apiUrl + '/user');
  }

  updateMe(data): Observable<any> {
    return this.http.post(environment.apiUrl + '/user/', data, { observe: 'response' });
  }

  updateProfilePhoto(data): Observable<any> {
    return this.http.post(environment.apiUrl + '/user/media/profile', data, { observe: 'response' });
  }

  resetPassword(data): Observable<any> {
    return this.http.post(environment.apiUrl + '/user/password/reset', data, { observe: 'response' });
  }

}
