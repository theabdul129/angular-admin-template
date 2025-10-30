import { Component, Inject, Input, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BasicActions } from '../basic-actions';

@Component({
    selector: 'app-save-delivery-address',
    templateUrl: './save-delivery-address.component.html',
    styleUrls: ['./save-delivery-address.component.scss'],
})
export class SaveDeliveryAddressComponent
    extends BasicActions
    implements OnInit
{
    @Input() address;

    form: UntypedFormGroup;
    constructor(
        public dialogRef: MatDialogRef<SaveDeliveryAddressComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: UntypedFormBuilder
    ) {
        super('');
        this.formInit();
    }

    formInit() {
        this.form = this.fb.group({
            address: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        if(this.data){
          this.form.patchValue({
              address: this.data,
          });
        }
    }

    closeModal() {
        this.dialogRef.close(null);
    }

    onSubmit() {
        if (this.form.invalid) {
            return;
        }
        this.dialogRef.close(this.form.value.address);
    }
}
