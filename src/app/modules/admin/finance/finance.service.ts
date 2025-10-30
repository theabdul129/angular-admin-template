import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FinanceService {
  lenderData: BehaviorSubject<any> = new BehaviorSubject(null);
  applicationData: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {}

  getAllLenders(pageNumber, pageSize): Observable<any> {
    let params = new HttpParams().append("page", pageNumber).append("pageSize", pageSize);
    return this.http.get(environment.apiUrl + "/merchants/lenders", { params });
  }

  getLender(id): Observable<any> {
    return this.http.get(environment.apiUrl + `/merchants/lenders/${id}`);
  }

  getPaymentsByBeneficiaryId(id, pageNumber, pageSize): Observable<any> {
    let params = new HttpParams().append("page", pageNumber).append("pageSize", pageSize);
    return this.http.get(environment.apiUrl + `/beneficiaries/${id}/payments`, { params });
  }

  saveMerchantLenders(payload, id) {
    return this.http.put(environment.apiUrl + `/merchants/lenders/${id}`, payload);
  }

  getDecision(id): Observable<any> {
    return this.http.get(environment.apiUrl + "/lenders/applications/decisions/" + id);
  }

  getApplicants(id): Observable<any> {
    return this.http.get(environment.apiUrl + "/lenders/applications/applicants/" + id);
  }

  getApplicationsStatuses(applicationId){
    return this.http.get(environment.apiUrl + `/lenders/applications/statuses/${applicationId}` );
  }

  getNotes(pageNumber, pageSize, financeAppId): Observable<any> {
    let params = new HttpParams().append("page", pageNumber).append("pageSize", pageSize);
    return this.http.get(environment.apiUrl + "/lenders/applications/notes/" + financeAppId, {
      params,
    });
  }

  saveNotes(data, id): Observable<any> {
    return this.http.post(environment.apiUrl + "/lenders/applications/notes/" + id, data, { observe: "response" });
  }

  getConsentData(applicationId){
    return this.http.get(environment.apiUrl + `/lenders/applications/consents/${applicationId}` );
  }

  getApplications(pageNumber,pageSize){
    let params = new HttpParams().append("page", pageNumber).append("pageSize", pageSize);
    return this.http.get(environment.apiUrl + `/lenders/applications` , {
      params,
    });
  }

  getApplication(id): Observable<any> {
    return this.http.get(environment.apiUrl + "/lenders/applications/" + id);
  }

  getSignatureData(applicationId){
    return this.http.get(environment.apiUrl + `/lenders/applications/documents/signature/${applicationId}` );
  }

  getMediaFileURL(fileUrl,contentType){
    let params = new HttpParams().append('fileUrl', fileUrl).append("contentType",contentType);
    return this.http.get(`${environment.apiUrl}/media/secure`,{params})
  }

}
