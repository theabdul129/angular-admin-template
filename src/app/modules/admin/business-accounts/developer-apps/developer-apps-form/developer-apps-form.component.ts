import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DeveloperApplications } from '../models/developer-apps.model';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { CrudService } from 'app/shared/services';
import { GLOBALS } from 'app/core/config/globals';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent } from '@angular/material/legacy-autocomplete';
import {  map, startWith } from 'rxjs/operators';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoDialogComponent } from 'app/shared/dialogs/info-dialog/info-dialog.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
    selector: 'app-developer-apps-form',
    templateUrl: './developer-apps-form.component.html',
    styleUrls: ['./developer-apps-form.component.scss'],
})
export class DeveloperAppsFormComponent implements OnInit {
    // DeveloperApplications model instance.
    copyIcon = false;
    public developerApps: DeveloperApplications;

    public labels = DeveloperApplications.attributeLabels;

    public fg: UntypedFormGroup;

    // To enable and disable submitted button.
    public formSubmitted = false;

    separatorKeysCodes: number[] = [ENTER, COMMA];
    public scopesList: any[] = [];

    // to store only mails for To fieLd
    public filteredOptions: Observable<string[]>;

    // auto complete chips controls

    scopes = new UntypedFormControl();
    allScopes: any[] = [];
    selectable = true;
    removable = true;
    addOnBlur = true;

    public pageActions = GLOBALS.pageActions; // To use same naming conventions for opening one form for multiple purposes

    // to store all scopes

    public selectedScopes: any[] = [];
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    public currentAction: string;

    developerAppId = '';
    developerAppData: any = {};

    //to get the reference of input field and to remove search text from input
    @ViewChild('scopeInput') scopeInput: ElementRef<HTMLInputElement>;


    constructor(
        private _gService: CrudService,
        private route: Router,
        private _activatedRoute: ActivatedRoute,
        public _matDialog: MatDialog,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {

        this.currentAction = this._activatedRoute.snapshot.data['currentAction'];

        this._initPage();
    }

    /**
     * Initialize page regarding Create, Update or view functionality as per provided action.
     *
     */
    private _initPage(): void {
        this.developerApps = new DeveloperApplications();

        this.fg = new UntypedFormGroup(this.developerApps.validationRules());
        this.isLoading.next(true);

        this._findScopesList()
            .then(() => {
                this._autoCompleteSearchControlForTo();
                this.isLoading.next(false);

                // Switch regarding page type
                if (this.currentAction === this.pageActions.create) {
                    this.isLoading.next(false);
                } else {

                    this._findRecord()
                        .then(() => {
                            if (
                                this.currentAction === this.pageActions.update
                            ) {
                                this.fg.enable();
                            }

                            this.isLoading.next(false);
                        })
                        .catch((error) => {
                            this.isLoading.next(false);

                            SWALMIXIN.fire({
                                icon: 'error',
                                title: error.error.message,
                            });
                        });
                }
            })
            .catch((error) => {
                this.isLoading.next(false);

                SWALMIXIN.fire({
                    icon: 'error',
                    title: error.error.message,
                });
            });
    }
    /**
     * Find record for Scopes dropdown.
     *
     */

    private _findScopesList(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const filterOptions = {
                page: 1,
                limit: GLOBALS.dropdownRecordLimit,
            };

            this._gService
                .read(`/system/security/scopes`, filterOptions)
                .subscribe(
                    (result) => {
                        this.allScopes = result;

                        resolve(true);
                    },
                    (error) => {
                        reject(error);
                    }
                );
        });
    }
    /**
     * push custom values in auto complete controls to respective arrays
     */

    public add(event: MatChipInputEvent): void {
        const input = event.input;

        const value = event.value;

        // // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    /**
     * remove values from chips
     */

    public removeScope(scope: string): void {
        const index = this.scopesList.indexOf(scope);

        if (index >= 0) {
            this.scopesList.splice(index, 1);
        }
    }

    private _filter(value: string): string[] {
        const filterValue = value?.toLowerCase() || '';
        if (value) {
            return this.allScopes.filter((option) =>
                option.name.toLowerCase().includes(filterValue)
            );
        } else {
            return this.allScopes;
        }
    }

    /**
     * push scope value in array on select scope from search list
     */

    public selected(event: MatAutocompleteSelectedEvent): void {
        const selectedOption = event.option.value;
        this.scopes.setValue(null);
        if (!this.scopesList.includes(selectedOption)) {
            this.scopesList.push(selectedOption);
            // // this.removeScopeFromMainList(event.option.viewValue);
        }
    }

    /**
     * Actively listen to To field and filter emails array on type or change value
     */

    private _autoCompleteSearchControlForTo(): void {
        this.filteredOptions = this.scopes.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value))
        );
    }

    saveForm() {
        if (!this.developerApps.id) {
            this.create();
        } else if (this.developerApps.id) {
            this.update();
        }
    }

    create() {
        this.formSubmitted = true;
        this.scopeInput.nativeElement.value = '';

        if (this.fg.invalid) return;

        this.isLoading.next(true);

        this._gService
            .put('/developerApplications', {
                ...this.fg.value,
                scopes: this.scopesList,
            })
            .subscribe(
                (data) => {
                    this.isLoading.next(false);
                  
                    SWALMIXIN.fire({
                      icon: 'success',
                      title: 'Developer application data has been saved.',
                  });

                  // to show secret key inn a popup after create

                 const dialogRef =  this._matDialog.open(InfoDialogComponent,{
                    data: {
                      clientSecret:data.clientSecret,
                      clientId:data.clientId
                    }
                  });
                  dialogRef.afterClosed().subscribe(()=>{

                  this.route.navigate(['/admin/business-account/edit/developer-apps/update/ ' + data['id']]);

                  })
                  
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

    update() {
        this.formSubmitted = true;
        if (this.fg.invalid) return;
        this.scopeInput.nativeElement.value = '';

        this.isLoading.next(true);

        this._gService
            .post(`/developerApplications/${this.developerApps.id}`, {
                ...this.fg.value,
                id:this.developerApps.id,
                scopes: this.scopesList,
                clientId: this.developerApps.clientId
            })
            .subscribe(
                (data) => {

                  this.developerApps = new DeveloperApplications(
                    data
                );

                this.fg.patchValue(this.developerApps);

                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Developer application data has been updated.',
                    });
                    this.isLoading.next(false);

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
    /**
     * Find record for view or update.
     *
     */
    private _findRecord(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._activatedRoute.params.subscribe((params) => {
                this.developerAppId = params['_id'];
                this._gService
                    .get(`/developerApplications/${params['_id']}`)
                    .subscribe(
                        (result) => {
                            this.developerApps = new DeveloperApplications(
                                result
                            );

                            this.fg.patchValue(this.developerApps);

                            this.scopesList = result.scopes;
                        },
                        (error) => {
                            reject(error);
                        }
                    );
            });
        });
    }

    // copy client id
    copyData() {
       this.copyIcon = true; 
       this._snackBar.open('client Id copy successfully', 'OK', {duration: 1500})

    }
}
