import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { Subject, BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { ThirdPartyConnectorsService } from '../third-party-connectors.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-third-party-resource',
    templateUrl: './third-party-resource.component.html',
    styleUrls: ['./third-party-resource.component.scss'],
})
export class ThirdPartyResourceComponent implements OnInit, OnDestroy {
    thirdPartyForm: FormGroup;
    @Input() pageTitle: string = '';
    @Input() connector: 'google-sheet' | 'google-analytics' | 'mail-chimp' |'google-drive' | 'Fb-Google-Ad';
    @Input() sourceType: string;
    @ViewChild('CSVFields') private CSVFields: ElementRef;
    private _unsubscribeAll: Subject<any> = new Subject();
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    selectedFile: any;
    @Output() saved = new EventEmitter();
    googleDriveForm:FormGroup;
    technologyProviders=['Drive','Rapid RTC',"eDynamix","DMS Navigator"];

    FBAdsForm:FormGroup
    mappingObject:any;
    private mappingValues:any={};
    gotMappingFields:boolean=false;
    googleDrivePayload:any;

    constructor(
        private formBuilder: FormBuilder,
        private connectorService: ThirdPartyConnectorsService,
        public dialog: MatDialog,
        private router:Router
    ) {
        this.thirdPartyForm = this.formBuilder.group({
            id: [null, Validators.required],
        });
        this.googleDriveForm = this.formBuilder.group({
            folder_url:[null, Validators.required],
            // tech_provider:[null, Validators.required],
        })
        this.FBAdsForm = this.formBuilder.group({
            account_id:[null, Validators.required],
            access_token:[null, Validators.required],
        })
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this.isLoading.next(null);
    }

    ngOnInit(): void {}

    onSubmit() {
        if (this.connector == 'google-sheet') {
            this.addGoogleSheet();
        } else if (this.connector == 'google-analytics') {
            this.addGoogleAnalytics();
        }else if (this.connector=='google-drive'){
            this.addGoogleDriveSource(); 
        }else if (this.connector=='Fb-Google-Ad'){
            this.addFBAdsSource(); 
        }
    }

    addGoogleSheet() {
        if (this.thirdPartyForm.invalid) {
            this.thirdPartyForm.markAllAsTouched();
            return;
        }
        if (!this.selectedFile) {
            SWALMIXIN.fire({
                icon: 'error',
                title: 'Please add a file',
            });
            return;
        }
        this.isLoading.next(true);
        const payload = new FormData();
        payload.append('credentials', this.selectedFile);
        payload.append('spreadsheet_id', this.thirdPartyForm.value.id);
        this.connectorService
            .saveGoogleSheetResource(payload)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (resp) => {
                    this.completed();
                },
                error: (err) => {
                    this.isLoading.next(false);
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: err?.error?.message || err?.message,
                    });
                },
            });
    }

    addGoogleAnalytics() {
        if (this.thirdPartyForm.invalid) {
            this.thirdPartyForm.markAllAsTouched();
            return;
        }

        if (!this.selectedFile) {
            SWALMIXIN.fire({
                icon: 'error',
                title: 'Please add a file',
            });
            return;
        }
        this.isLoading.next(true);
        const payload = new FormData();
        payload.append('credentials', this.selectedFile);
        this.connectorService
            .saveGoogleAnalyticsConnector(payload)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (resp) => {
                    this.completed();
                },
                error: (err) => {
                    this.isLoading.next(false);
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: err?.error?.message || err?.message,
                    });
                },
            });
    }

    addMailChimp() {
        if (this.thirdPartyForm.invalid) {
            this.thirdPartyForm.markAllAsTouched();
            return;
        }
        this.isLoading.next(true);
        this.connectorService
            .saveMailChimpResource({
                api_key: this.thirdPartyForm.value.id,
            })
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (resp) => {
                    this.completed();
                },
                error: (err) => {
                    this.isLoading.next(false);
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: err?.error?.message || err?.message,
                    });
                },
            });
    }

    selectedFileEvent(selectedFile) {
        this.selectedFile = selectedFile;
    }

    //#region Google-Drive
    addGoogleDriveSource() {
        if (this.googleDriveForm.invalid) {
            this.googleDriveForm.markAllAsTouched();
            return;
        }
        if (!this.selectedFile) {
            SWALMIXIN.fire({
                icon: 'error',
                title: 'Please add a file',
            });
            return;
        }
        this.isLoading.next(true);
        const payload = new FormData();
        payload.append('credentials', this.selectedFile);
        payload.append('folder_url', this.googleDriveForm.value.folder_url);
        payload.append('source_name', this.sourceType);
        this.googleDrivePayload=payload;
        this.connectorService
            .getMappingFieldsForGoogleDriveSource(payload)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (resp) => {
                    this.isLoading.next(false);
                    this.gotMappingFields=true;
                    this.mappingObject=resp;
                    this.openModal(this.CSVFields);
                },
                error: (err) => {
                    this.isLoading.next(false);
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: err?.error?.message || err?.message,
                    });
                },
            });
    }

    updateRequiredField(event: any, field: string) {
        this.mappingValues[field] = event?.value;
    }
    
    removeUnderScore(str : String){
        return str?.replace(/_/g, ' ');
    }

    connectGoogleDrive() {
        if (this.mappingObject?.required_fields?.length > 0) {
            if (this.googleDrivePayload.has('mapping')) this.googleDrivePayload.delete('mapping');
            this.googleDrivePayload.append('mapping',JSON.stringify(this.mappingValues));
            let allRequiredFieldsSelected = true;
            this.mappingObject?.required_fields?.forEach((field) => {
                if (!this.mappingValues[field]) {
                    allRequiredFieldsSelected = false;
                }
            });
            if(!allRequiredFieldsSelected){
                SWALMIXIN.fire({
                    icon: 'error',
                    title: "Please fill all the required fields",
                });
                return;
            }
        }else{
            this.googleDrivePayload.append('mapping','');
        }
        this.isLoading.next(true);
        this.connectorService
            .addGoogleDriveSource(this.googleDrivePayload)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (resp) => {
                    this.isLoading.next(false);
                    this.completed();
                },
                error: (err) => {
                    this.isLoading.next(false);
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: err?.error?.message || err?.message,
                    });
                },
            });
    }

    openModal(modal) {
        this.dialog.open(modal, { width: '650px',disableClose: true  });
    }

    closeModal() {
        this.dialog.closeAll();
    }

    //#endregion

    addFBAdsSource() {
        if (this.FBAdsForm.invalid) {
            this.FBAdsForm.markAllAsTouched();
            return;
        }

        this.isLoading.next(true);
        const payload = new FormData();
        payload.append('account_id', this.FBAdsForm.value.account_id);
        payload.append('access_token', this.FBAdsForm.value.access_token);
        this.connectorService
            .addFBAdsSource(payload)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (resp) => {
                    this.completed();
                },
                error: (err) => {
                    this.isLoading.next(false);
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: err?.error?.message || err?.message,
                    });
                },
            });
    }

    completed() {
        this.isLoading.next(false);
        SWALMIXIN.fire({
            icon: 'success',
            title: 'Connection has saved',
        });
        this.closeModal();
        this.router.navigateByUrl("/admin/connectors")
    }

    cancel() {
        this.isLoading.next(false);
        this.saved.emit(true);
    }
}
