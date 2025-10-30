import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommunicationService } from '../../communication.service';
import { CommunicationDetailComponent } from '../communication-detail.component';

@Component({
    selector: 'communication-basic-info',
    templateUrl: './basic-info.component.html'
})
export class CommunicationBasicDetailComponent implements OnInit {

    accountForm: UntypedFormGroup;
    accountId: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    accountData: any;
    communicationData: any;
    communicationId: any;

    constructor(
        private communicationComponent: CommunicationDetailComponent,
        private fb: UntypedFormBuilder,
        private communicationService: CommunicationService,
        private route: Router,
        public dialog: MatDialog
    ) {
        this.accountForm = this.fb.group({
            companyNumber: ['', Validators.required],
            legalName: ['', Validators.required],
            website: [''],
            vatId: [''],
            description: [''],
            registeredAddress: ['', Validators.required],
        })
    }

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.communicationId = id[3];
        if (this.communicationId) this.loadData();
        this.communicationComponent.matDrawer.toggle();
    }

    loadData() {
        this.isLoading.next(true);
        this.communicationService.getServicesBodies(this.communicationId).subscribe(data => {
            this.isLoading.next(false);
            this.communicationData = data.body;
        }, error => this.isLoading.next(false));
    }

}