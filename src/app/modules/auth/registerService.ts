import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class RegisterService {
  constructor(private http: HttpClient) {}
  registerMerchant(registerMerchant): Observable<any> {

    return this.http.put(environment.managementUrl + "/register/merchant", registerMerchant, { observe: "response" });
  }
}
