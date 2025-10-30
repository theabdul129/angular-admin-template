import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BasicActions } from 'app/shared/basic-actions';
import { takeUntil } from 'rxjs';
import { ThirdPartyConnectorsService } from '../third-party-connectors.service';
import Swal from 'sweetalert2';
import { SWALMIXIN } from 'app/core/services/mixin.service';

@Component({
    selector: 'app-datasource-listing',
    templateUrl: './datasource-listing.component.html',
    styleUrls: ['./datasource-listing.component.scss'],
})
export class DatasourceListingComponent
    extends BasicActions
    implements OnInit, OnDestroy
{
    displayedColumns: string[] = [
        'name',
        'sourceLocation',
        'strength',
        'created_at',
        'lastSyncDate',
        'action',
    ];
    dataSource: any;
    errorMsg: any;
    totalAccounts: any;

    constructor(
        private thirdPartyService: ThirdPartyConnectorsService,
    ) {
        super('');
    }

    ngOnInit(): void {
        this.getAllDataSources();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this.isLoading.next(false);
    }

    getAllDataSources() {
        this.loading(true);
        this.dataSource = new MatTableDataSource();
        this.thirdPartyService
            .getAllDataSources()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (data) => {
                    this.loading(false);
                    this.dataSource.data = data;
                },
                (error) => {
                    this.loading(false);
                    this.errorMsg = error.message;
                }
            );
    }

    deleteDataSource(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                this.loading(true);
                this.thirdPartyService.deleteDataSource(id).subscribe(
                    (data) => {
                        this.loading(false);
                        this.getAllDataSources();
                        SWALMIXIN.fire({
                            icon: 'success',
                            title: 'Removed successfuly.',
                        });
                    },
                    (error) => {
                        this.loading(false);
                        SWALMIXIN.fire({
                            icon: 'error',
                            title: error?.error?.message || error?.message,
                        });
                    }
                );
            }
        });
    }

    syncDataSource(connection_id) {
        this.loading(true);
        this.thirdPartyService
            .resyncDataSource({connection_id})
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (resp) => {
                    this.loading(false);
                    this.getAllDataSources()
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Synced successfully',
                    });
                },
                error: (error) => {
                    this.loading(false);
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error?.error?.message || error?.message,
                    });
                },
            });
    }
}
