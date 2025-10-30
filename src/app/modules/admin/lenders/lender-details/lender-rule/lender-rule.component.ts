import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { LenderProductRule } from 'app/models/lenderProductRule';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { LenderService } from '../../lender.service';

@Component({
    selector: 'app-lender-rule',
    templateUrl: './lender-rule.component.html',
})
export class LenderRuleComponent implements OnInit {
    heading = 'Lenders';
    icon = 'pe-7s-display1 icon-gradient bg-premium-dark';
    lenderproductForm: UntypedFormGroup;
    invalidForm = false;

    filterArgs = { archived: null };
    selectedLenderRule;
    showOverlay = false;
    lenderId;
    ruleId;
    productId;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    errorMsg: any;
    formSubmitted: boolean = false;
    dataSource: any;
    totalAccounts: any;
    paginator: any;
    pageNumber: any;
    pageSize: any;

    displayedColumns: string[] = ['id', 'name', 'action'];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private router: Router,
        public dialog: MatDialog,
        private lenderRule: LenderService
    ) {
        this.lenderproductForm = this.formBuilder.group({
            ruleName: null,
        });
    }

    ngOnInit() {
        let id = this.router.url.split(['/'][0]);
        this.lenderId = Number(id[4]);
        this.productId = Number(id[6]);
        if (this.lenderId) {
            this.loadLenderRule();
        }
    }

    paginate(event: PageEvent) {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadLenderRule();
    }
    loadLenderRule() {
        this.isLoading.next(true);
        this.dataSource = new MatTableDataSource();
        this.lenderRule.getLenderRule(this.lenderId, this.productId).subscribe(
            (data: any) => {
                this.dataSource.data = data.data;
                this.dataSource.paginator = this.paginator;
                this.totalAccounts = data.totalSize;
                this.isLoading.next(false);
            },
            (error) => {
                this.isLoading.next(false);
                this.errorMsg = error.message;
            }
        );
    }
    onSubmit() {
        this.formSubmitted = true;
        if (this.lenderproductForm.invalid) return;
        if (this.ruleId) this.update();
        else this.save();
    }

    save() {
        this.isLoading.next(true);
        const registerPayload: LenderProductRule = {
            ruleName: this.lenderproductForm.controls.ruleName.value,
        };
        this.lenderRule
            .savelenderRule(
                registerPayload,
                this.lenderId,
                this.productId,
                null
            )
            .subscribe(
                (data) => {
                    this.isLoading.next(false);
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Your Lender Rule have been saved.',
                    });
                    this.dialog.closeAll();
                    this.loadLenderRule();
                },
                (error) => {
                    this.isLoading.next(false);
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                }
            );
    }

    update() {
        this.isLoading.next(true);
        const id = this.ruleId;
        const registerPayload: LenderProductRule = {
            id: this.selectedLenderRule && this.selectedLenderRule.id,
            ruleName: this.lenderproductForm.controls.ruleName.value,
        };
        this.lenderRule
            .savelenderRule(registerPayload, this.lenderId, this.productId, id)
            .subscribe(
                (data) => {
                    this.isLoading.next(false);
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Your Lender Rule have been Update.',
                    });
                    this.dialog.closeAll();
                    this.loadLenderRule();
                },
                (error) => {
                    this.isLoading.next(false);
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                }
            );
    }

    delete(id) {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.lenderRule.deleteLenderRule(this.lenderId,this.productId,id).subscribe(data => {
              if (data.status != 200) return;
              SWALMIXIN.fire({
                icon: 'success',
                title: 'Removed successfuly.',
              });
              this.loadLenderRule();
            }, error => {
              SWALMIXIN.fire({
                icon: 'error',
                title: error.error.errorMessage,
              });
            });
          }
        });
      }

    closeModal() {
        this.dialog.closeAll();
    }

    openModal(modal, data) {
        this.dialog.open(modal, { width: '600px' });
        this.lenderproductForm.reset();
        this.ruleId = null;
        if (data) {
            this.ruleId = data;
            this.isLoading.next(true);
            this.lenderRule
            .getLenderRuleId(this.lenderId, this.productId, data)
                .subscribe((data) => {
                    this.isLoading.next(false);
                    this.selectedLenderRule = data;
                    this.lenderproductForm.patchValue({
                        ruleName: data.ruleName,
                    });
                });
        }
    }
}
