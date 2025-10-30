import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class CollaboratorService {
  constructor(private http: HttpClient) {}

  get(accountCollaboratorId): Observable<any> {
    return this.http.get(environment.apiUrl + "/businessAccounts/collaborators/" + accountCollaboratorId);
  }

  getAllCollaborators(pageNumber, pageSize): Observable<any> {
    let params = new HttpParams().append("page", pageNumber).append("pageSize", pageSize);
    return this.http.get(environment.apiUrl + "/businessAccounts/collaborators", { params });
  }

  getRoles(accountCollaboratorId): Observable<any> {
    return this.http.get(environment.apiUrl + "/businessAccounts/collaborators/roles/" + accountCollaboratorId);
  }

  addRole(collaboratorId, payload): Observable<any> {
    return this.http.post(environment.apiUrl + "/businessAccounts/collaborators/roles/" + collaboratorId, payload);
  }

  inviteUser(inviteUser): Observable<any> {
    return this.http.post(environment.apiUrl + "/businessAccounts/collaborators/invitations", inviteUser, { observe: "response" });
  }

  searchCollaborators(search): Observable<any> {
    return this.http.get(environment.apiUrl + "/businessAccounts/collaborators/?page=" + 0 + "&s=" + search);
  }

  update(payload, storeCollaboratorId): Observable<any> {
    return this.http.post(environment.apiUrl + "/businessAccounts/collaborators/" + storeCollaboratorId, payload, { observe: "response" });
  }
  getAllRoles(): Observable<any> {
    return this.http.get(environment.apiUrl + "/system/security/scopes/roles");
  }
}
