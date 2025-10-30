import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-support',
    templateUrl: './support.component.html',
})

export class SupportComponent implements OnInit {

    supportForm: UntypedFormGroup;
    formSubmitted: boolean = false;

    constructor(
        private _formBuilder: UntypedFormBuilder,
    ) {
        this.supportForm = this._formBuilder.group({
            subject: ['', Validators.required],
            message: ['', Validators.required]
        });
    }

    ngOnInit() { }

    clearForm() {
        this.supportForm.reset();
    }

    sendForm(): void {
        this.formSubmitted = true;
        if (this.supportForm.invalid) return;
    }
}
