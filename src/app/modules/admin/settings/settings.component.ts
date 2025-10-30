import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SettingsService } from './settings.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {

    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['account', 'val', 'edit', 'action'];
    dataSource: any;
    errorMsg: any;
    totalAccounts: any;
    form: UntypedFormGroup;
    formSubmitted: boolean = false;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    selectedData: any;

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private settings: SettingsService,
        private route: Router,
        private fb: UntypedFormBuilder,
        private dialog: MatDialog,
    ) {
        this.form = this.fb.group({
            key: ['', Validators.required],
            value: ['', Validators.required],
            keyEditable: ['']
        })
    }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.settings.getAll(this.paginator ? this.paginator.pageIndex : this.pageNumber, this.paginator ? this.paginator.pageSize : this.pageSize)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            ).subscribe((data: any) => {
                this.dataSource.data = data.data;
                this.dataSource.paginator = this.paginator;
                this.totalAccounts = data.totalSize;
            }, error => {
                this.isLoading.next(false);
                this.errorMsg = error.message;
            })
    }

    paginate(event: PageEvent) {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getData();
    }

    openModal(modal, data) {
        this.dialog.open(modal, { width: '500px' });
        this.selectedData = data;
        if (this.selectedData) {
            this.form.patchValue({
                key: this.selectedData.key,
                value: this.selectedData.value,
                keyEditable: this.selectedData.keyEditable
            });
        } else {
            this.form.reset();
            this.form.patchValue({
                keyEditable: true
            });
        }
    }

    closeModal() {
        this.dialog.closeAll();
    }

    onSubmit() {
        this.formSubmitted = true;
        if (this.form.invalid) return;
        this.isLoading.next(true);
        if (!this.selectedData) this.form.value.id = 0;
        this.dialog.closeAll();
        this.settings.save(this.form.value, this.selectedData ? this.selectedData.id : null).pipe(
            finalize(() => {
                this.isLoading.next(false);
                this.formSubmitted = false;
            })
        )
            .subscribe((data: any) => {
                if (data.status != 200) return;
                SWALMIXIN.fire({
                    icon: 'success',
                    title: 'Your settings details have been saved.',
                });
                this.getData();
            }, error => {
                this.isLoading.next(false);
                this.formSubmitted = false;
                SWALMIXIN.fire({
                    icon: 'error',
                    title: error.error.errorMessage,
                });
            })
    }
}