import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThirdPartyConnectorsService {

  constructor(private http: HttpClient) {}

  saveGoogleAnalyticsConnector(payload){
    return this.http.post(environment.analyticsUrl + '/create_airbyte_google-analytics_resource/',payload);
  }

  saveGoogleSheetResource(payload){
    return this.http.post(environment.analyticsUrl + "/create_airbyte_google-sheets_resource/",payload)
  }

  saveMailChimpResource(payload){
    return this.http.post(environment.analyticsUrl + "/create_airbyte_mailchimp_resource/",payload)
  }

  getAllDataSources(){
    return this.http.get(environment.analyticsUrl + `/connections/`);
  }

  deleteDataSource(connection_id){
    return this.http.post(environment.analyticsUrl + `/delete_connection/`,{connection_id});
  }

  addGoogleDriveSource(payload){
    return this.http.post(environment.analyticsUrl + `/create_airbyte_google-drive_resource/`,payload);
  }
  getMappingFieldsForGoogleDriveSource(payload){
    return this.http.post(environment.analyticsUrl + `/google_drive_resource_mapping/`,payload);
  }

  addFBAdsSource(payload){
    return this.http.post(environment.analyticsUrl + `/create_airbyte_facebook-ads_resource/`,payload);
  }

  resyncDataSource(payload){
    return this.http.post(environment.analyticsUrl + `/create_sync_job/`,payload);
  }

}
