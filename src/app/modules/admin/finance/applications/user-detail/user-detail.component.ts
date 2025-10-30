import { Component, Input, OnDestroy,OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FinanceService } from '../../finance.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy{

  @Input() applicationId;
  userData: any;
  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(private financeService:FinanceService) {}
  document:any;
  signatureImage: any;

  ngOnInit(): void {
      this.getUserDetails();
  }
  getUserDetails() {
      this.getSignature();
      this.financeService
          .getApplicants(this.applicationId)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((data: any) => {
              this.userData = data.data;
          });
  }
  getSignature() {
      this.financeService
          .getSignatureData(this.applicationId)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe({
              next: (data: any) => {
                  this.document=data;
                  this.getMediaFileURL(data);
              },
              error: (Err) => {
                  console.log('Err in signature: ', Err);
              },
          });
  }

  getMediaFileURL(doc) {
      this.financeService
          .getMediaFileURL(doc?.fileUrl, doc?.contentType)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe({
              next: (resp: any) => {
                  if (resp) this.signatureImage = resp.url;
              },
              error: (err) => {
                  console.log('Error: ', err);
              },
          });
  }
  ngOnDestroy(): void {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }
  
}
