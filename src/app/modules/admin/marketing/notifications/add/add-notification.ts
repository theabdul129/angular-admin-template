import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NotificationsService } from '../notifications.service';

@Component({
    selector: 'app-add-notification',
    templateUrl: './add-notification.html'
})

export class AddNotificationComponent implements OnInit {

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();

    form: UntypedFormGroup;
    formSubmitted: boolean = false;

    constructor(
        private notifications: NotificationsService,
        private fb: UntypedFormBuilder
    ) {
        this.form = this.fb.group({
            title: ['', Validators.required],
            text: ['', Validators.required],
            name: ['', Validators.required],
            image: [],
            topic: [],
            schedule: []
        })
    }

    ngOnInit() {
    }

    getFile(file) {

    }

    onSubmit() {
        this.formSubmitted = true;
        if (this.form.invalid) return;
    }
}