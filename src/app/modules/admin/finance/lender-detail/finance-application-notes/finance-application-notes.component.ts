import { Component, Input } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { ApplictionNotes } from './application-notes';
import { FinanceService } from '../../finance.service';

@Component({
    selector: 'app-finance-application-notes',
    templateUrl: './finance-application-notes.component.html',
    styleUrls: ['./finance-application-notes.component.scss'],
})
export class FinanceApplicationNotesComponent {
    @Input() applicationId;
    userForm: FormGroup;
    displayedColumns: string[] = ['date', 'content'];
    dataSource: any;
    errorMsg;
    constructor(
        public dialog: MatDialog,
        private formBuilder: FormBuilder,
        private financeService: FinanceService
    ) {
        this.userForm = this.formBuilder.group({
            comments: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.getNotes();
    }
    getNotes() {
        this.financeService.getNotes(0, 10, this.applicationId).subscribe({
            next: (data) => {
                this.dataSource = data?.data;
            },
            error: (err) => {
                this.errorMsg = err?.error?.message || err?.message;
            },
        });
    }
    onSubmit() {
        this.save();
    }
    save() {
        const registerPayload: ApplictionNotes = {
            id: 0,
            text: this.userForm.controls.comments.value,
            createWarningFromNote: true,
            visibleToIntroducer: true,
            visibleToLender: true,
        };
        this.financeService
            .saveNotes(registerPayload, this.applicationId)
            .subscribe(
                (data) => {
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Your product details have been saved.',
                    });
                    this.dialog.closeAll();
                    this.userForm.reset();
                    this.getNotes();
                },
                (error) => {
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error?.error?.message || error?.message,
                    });
                }
            );
    }

    openModal(modal) {
        this.dialog.open(modal, { width: '600px' });
    }
    closeModal() {
        this.dialog.closeAll();
    }
}
