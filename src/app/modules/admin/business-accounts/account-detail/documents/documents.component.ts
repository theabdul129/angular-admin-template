import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { BusinessAccountService } from '../../business-account.service';
import { AccountDetailComponent } from '../account-detail.component';
import { map } from 'rxjs/operators';
import { MediaService } from 'app/core/services/media.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { finalize } from 'rxjs/operators';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
  pageSize: number = 10;
  pageNumber: number = 0;
  accountId;
  previewUrl: any = [];
  fileDatas: [File] = null;
  showUpload = false;
  fileUploadProgress: string = null;
  form: UntypedFormGroup;
  selectedFile: any = null;
  activeFile;
  buttonDisabled = true;
  errorMsg;
  displayedColumns: string[] = ['id', 'name', 'credit', 'validFrom', 'action'];
  dataSource: any;
  totalAccounts;

  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

  constructor(
    private businessService: BusinessAccountService,
    private accountComponent: AccountDetailComponent,
    public dialog: MatDialog,
    private route: Router,
    private mediaService: MediaService,
    private fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({
      documentType: [''],
      notes: [''],
      file: ['']
    });
  }

  ngOnInit(): void {
    if(window.innerWidth<769)this.toggleDrawer();
    this.getDocs();
    const businessAccountId = this.route.url.split(['/'][0]);
    this.accountId = businessAccountId[4];
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
    this.OnUploadImage(this.selectedFile);

  }

  getDocs() {
    this.isLoading.next(true);
    this.businessService.allDocuments(this.pageNumber, this.pageSize)
      .pipe(
        finalize(() => {
          this.isLoading.next(false);
        })
      ).subscribe((data: any) => {
        this.totalAccounts = data.totalSize;
        this.dataSource.data = data.data;
        this.dataSource.paginator = this.paginator;
      }, (error) => {
        this.isLoading.next(false);
        this.errorMsg = error.message;
      });
  }

  paginate(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getDocs();
  }

  toggleDrawer() {
    this.accountComponent.matDrawer.toggle();
  }

// removed for card BSKT-448
/*   openModal(modal) {
    this.buttonDisabled = true;
    this.dialog.open(modal, { width: '500px' });
  } */

  closeModal() {
    this.dialog.closeAll();
  }

  OnUploadImage(fileData) {
    let fileName;
    fileName = this.businessService
      .generateImageUrl(this.accountId)
      .pipe(
        map(val => val.url)
      ).subscribe((url) => {
        this.mediaService.getUploadPublicUrl({ fileUrl: url, contentType: fileData.type })
          .subscribe((data) => {
            this.activeFile = data.body;
            this.activeFile.type = fileData.type;
            this.buttonDisabled = false;
          });
      });
  }

  onSubmit() {
    delete this.form.value.file;
    this.form.value.fileName = this.activeFile.fileName;
    this.form.value.fileUrl = this.activeFile.url;
    this.form.value.contentType = this.activeFile.type;
    this.businessService.addDocument(this.form.value).subscribe((data) => {
      if (data.status != 200) {return;}
      SWALMIXIN.fire({
        icon: 'success',
        title: 'Your document details have been saved.',
      });
      this.getDocs();
    }, (error) => {
      this.isLoading.next(false);
      SWALMIXIN.fire({
        icon: 'error',
        title: error.error.errorMessage,
      });
    });
  }

}
