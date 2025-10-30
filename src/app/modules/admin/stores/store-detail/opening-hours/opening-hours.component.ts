import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { CalendarBlock } from 'app/models/calendarblock';
import moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { StoreService } from '../../store.service';
import { StoreDetailComponent } from '../store-detail.component';

@Component({
    selector: 'stock-openinghours',
    templateUrl: './opening-hours.component.html'
})
export class OpeningHoursComponent implements OnInit {

    pageSize: number = 10;
    pageNumber: number = 0;
    displayedColumns: string[] = ['id', 'name', 'created', 'action'];
    dataSource: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    storeId: any;
    errorMsg: any;
    totalAccounts: any;
    form: UntypedFormGroup;
    formSubmitted: boolean = false;
    selectedData: any;
    cronExpression: any;
    startDate:any;
    endDate: any;

    @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

    constructor(
        private storeService: StoreService,
        private route: Router,
        private storeComponent: StoreDetailComponent,
        private dialog: MatDialog,
        private formBuilder: UntypedFormBuilder
    ) {
        this.form = this.formBuilder.group({
            id: [null],
            title: [null, Validators.required],
            startDateTime: [null, Validators.required],
            allDay: [null],
            endDateTime: [null, Validators.required],
            repeatInterval: [null],
            repeatUntil: [null],
            description: [null]
        });
    }

    dateRange = new UntypedFormGroup({
        start: new UntypedFormControl(moment()),
        end: new UntypedFormControl(moment())
    });

    ngOnInit() {
        let storeId = this.route.url.split(['/'][0]);
        this.storeId = Number(storeId[4]);
    }

    loadData() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.storeService.getWorkingTimes(this.startDate, this.endDate, this.storeId)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            ).subscribe((data: any) => {
                this.dataSource.data = data.body.calendarBlocks;
                this.isLoading.next(false);
            }, error => {
                this.isLoading.next(false);
                this.errorMsg = error.message;
            })
    }

    toggleDrawer() {
        this.storeComponent.matDrawer.toggle();
    }

    decline(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, decline it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.isLoading.next(true);
                this.storeService.deleteCalendarBlock(this.storeId, id)
                    .subscribe(data => {
                        if (data.status != 200) return;
                        this.isLoading.next(false);
                        SWALMIXIN.fire({
                            icon: 'success',
                            title: 'Declined successfuly.',
                        });
                        this.loadData();
                    }, error => {
                        this.isLoading.next(false);
                        SWALMIXIN.fire({
                            icon: 'error',
                            title: error.error.errorMessage,
                        });
                    });
            }
        });
    }

    openModal(modal, data) {
        this.dialog.open(modal, { width: '600px' });
        this.selectedData = data;
        if (this.selectedData) {
            this.form.patchValue({
                title: this.selectedData.title,
                startDateTime: this.selectedData.startAt,
                allDay: this.selectedData.allDay,
                endDateTime: this.selectedData.endAt,
                repeatInterval: this.selectedData.repeatInterval,
                repeatUntil: this.selectedData.repeatUntil,
                description: this.selectedData.description
            });
        } else this.form.reset();
    }

    closeModal() {
        this.dialog.closeAll();
    }

    mapChanges(mapEvent) {
        const selEvent = mapEvent.meta.event;
        // this.selectedMoments = [mapEvent.start, mapEvent.end];
        if (selEvent != undefined) {
            this.cronExpression = selEvent.repeatInterval;
            return {
                id: selEvent.id,
                title: mapEvent.title,
                startDateTime: mapEvent.start,
                allDay: selEvent.allDay,
                endDateTime: mapEvent.end,
                repeatInterval: selEvent.repeatInterval,
                repeatUntil: selEvent.repeatUntil,
                description: selEvent.description
            };
        } else {
            return {
                title: mapEvent.title,
                startDateTime: mapEvent.start,
                endDateTime: mapEvent.end
            };
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const property in changes) {
            if (property === "selectedBlock") {
                this.form.patchValue(
                    this.mapChanges(changes[property].currentValue)
                );
            }
        }
    }

    onSubmit() {
        this.formSubmitted = true;
        if (this.form.invalid) return;
        const payload: CalendarBlock = {
            id: 0,
            title: this.form.value.title,
            startAt: this.form.value.startDateTime,
            allDay: this.form.value.allDay,
            endAt: this.form.value.endDateTime,
            repeatInterval: this.cronExpression,
            repeatUntil: this.form.value.repeatUntil.value,
            description: this.form.value.description
        };
        this.isLoading.next(true);
        this.storeService.saveCalendarBlock(payload, this.storeId, 0)
            .pipe(
                finalize(() => {
                    this.dialog.closeAll();
                    this.isLoading.next(false);
                })
            ).subscribe(data => {
                this.loadData();
            })
    }

    applyFilter() {
        if (this.dateRange.value.start) this.startDate = moment(this.dateRange.value.start).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        if (this.dateRange.value.end) this.endDate = moment(this.dateRange.value.end).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        this.loadData();
    }
}