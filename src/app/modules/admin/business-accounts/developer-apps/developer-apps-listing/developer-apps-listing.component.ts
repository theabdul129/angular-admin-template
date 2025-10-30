import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DeveloperApplications } from '../models/developer-apps.model';
import { CrudService } from 'app/shared/services';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { setPaginator } from 'app/core/config/globals';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { InfoDialogComponent } from 'app/shared/dialogs/info-dialog/info-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AccountDetailComponent } from '../../account-detail/account-detail.component';

@Component({
    selector: 'app-developer-apps-listing',
    templateUrl: './developer-apps-listing.component.html',
    styleUrls: ['./developer-apps-listing.component.scss'],
})
export class DeveloperAppsListingComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject();
    private _subscriptions = { getData: null }; // to manage/cancel any subscription manually.

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();

    public dataSource: any; // table data source
    displayedColumns: string[] = ['id', 'name', 'description', 'action'];
    private _recordLimit = 10;

    public labels = DeveloperApplications.attributeLabels;
    public filterOptions = {
        page: 0,
        limit: this._recordLimit || 10,
    };
    public tableAttributes = { totalRecords: 0, pageSizeOptions: null, pageSize: null }; // To manage Table Pagination

  // To control pagination/sort/search pragmatically
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  errorMsg: any;

    private _confirmDialogRef: any;
    developerApps: any;
    constructor(
        private _gService: CrudService,
        private cdr: ChangeDetectorRef,
        public _matDialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private accountComponent: AccountDetailComponent,
    ) {}

    /**
     * Self destruct on close.
     *
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        if (this._subscriptions.getData) {
            this._subscriptions.getData.unsubscribe();
        }
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    ngOnInit(): void {
    if(window.innerWidth<769)this.toggleDrawer();
      this._reset();
      this.getData();
    }

    /**
     * Get data from backend and update table.
     *
     * @param reset boolean | optional
     */
    public getData(reset?): void {
        if (this._subscriptions.getData) {
            this._subscriptions.getData.unsubscribe();
        }

        this.isLoading.next(true);

        if (reset) {
            this._reset();
        }

        this._subscriptions.getData = this._gService
            .read('/developerApplications', this.filterOptions)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((resp: any) => {

                this.dataSource = new MatTableDataSource<any>(resp?.data);

                this.cdr.detectChanges();
                this.tableAttributes.totalRecords = resp.totalSize;

                this.isLoading.next(false);
            });
    }

    /**
     * Reset table properties and filter options.
     *  - to Reset api query
     *    - Reset filterOptions
     *  - Reset tableAttributes
     *  - To reset/update UI
     *    - Reset mat-table sort property
     *    - Reset mat-table pagination property (pageSize)
     */
    private _reset(): void {
        

    const paginatorObj =  setPaginator(this._recordLimit);
    ;
    
        this.tableAttributes.pageSizeOptions = paginatorObj['pageSizeOptions'];
        this.tableAttributes.pageSize = paginatorObj['pageSize'];
        this.filterOptions.limit = paginatorObj['pageSize'];
        this.filterOptions.page = 0
        // If user changed the page size, this will reset it on UI
        this.paginator.pageSize = paginatorObj['pageSize'];
    
        // If sort is applied, this will remove that sort. Note: If any default sort is implemented than update following accordingly.
        // this.sort.direction = null;
        // this.sort.active = null;
        // this.sort._stateChanges.next();
    }

    /**
     * Delete record
     *
     * @param _id string
     */
    public delete(_id): void {
        // Open the dialog and save the reference of it
        this._confirmDialogRef =  this._fuseConfirmationService.open();
        
        this._confirmDialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                this.isLoading.next(true);

                this._gService
                    .delete(`/developerApplications/${_id}`)
                    .subscribe(() => {
                      this.isLoading.next(false);

                        this.getData();
                    },(err)=>{
                        console.log("err:",err);
                        SWALMIXIN.fire({
                            icon: 'error',
                            title: err?.error?.message || err.message,
                        });
                    });
            }

            this._confirmDialogRef = null;
        });
    }

  /**
   * Change Page
   * @param event PageEvent
   */
  public changePage(event: PageEvent): void {

    this.filterOptions.limit = event.pageSize;
    this.filterOptions.page = event.pageIndex + 1;

    this.getData();

  }

  /**
   * Toggle Drawer
   */
  public toggleDrawer() {
    this.accountComponent.matDrawer.toggle();
  }

    /**
   * Sort data.
   * 
   * @param event obj
   */
    public sortData(event): void {

      // this.filterOptions.sort = {};
      // this.filterOptions.sort[event.active] = event.direction === 'asc' ? 1 : -1;
      // this.getData();
  
    }
    rotateSecretId(id){

      this.isLoading.next(true);

      this._gService
          .patch(`/developerApplications/${id}`, {})
          .subscribe(
              (data) => {
                this.developerApps = data
                  this.isLoading.next(false);

                  SWALMIXIN.fire({
                      icon: 'success',
                      title: 'Developer application has rotated successfully.',
                  });

                   // to show secret key inn a popup after rotate

                 const dialogRef =  this._matDialog.open(InfoDialogComponent,{
                    data: {
                      clientSecret:data.clientSecret,
                      clientId:data.clientId
                    }
                  });
                 
              },
              (error) => {
                  this.isLoading.next(false);

                  SWALMIXIN.fire({
                      icon: 'error',
                      title: error.error.message,
                  });
              }
          );
    }
}
