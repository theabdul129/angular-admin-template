import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { BusinessAccountService } from '../../../business-account.service';
import { takeUntil } from 'rxjs/operators';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { AccountDetailComponent } from '../../account-detail.component';

@Component({
    selector: 'app-web-hook-form',
    templateUrl: './web-hook-form.component.html',
    styleUrls: ['./web-hook-form.component.scss'],
})
export class WebHookFormComponent implements OnInit {
    webHookForm: UntypedFormGroup;
    events: string[] = [];
    private _unsubscribeAll: Subject<any> = new Subject();
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    constructor(
        private activatedRoute: ActivatedRoute,
        private formBuilder: UntypedFormBuilder,
        private businessAccountService: BusinessAccountService,
        private accountComponent: AccountDetailComponent,
        private router: Router
    ) {
        this.webHookForm = this.formBuilder.group({
            environment: [null, Validators.required],
            webHookUrl: [null, Validators.required],
            events: [null, Validators.required],
        });
    }

    ngOnInit(): void {
        this.getWebHooksEventsForSelectBox();
        this.activatedRoute.params.subscribe((param) => {
            if (param?.env == 1) {
                this.webHookForm.patchValue({
                    environment: "production",
                });
                this.getWEbHooks("production");
            }
            if (param?.env == 2) {
                this.webHookForm.patchValue({
                    environment: "sandbox",
                });
                this.getWEbHooks("sandbox");
            }
        });
    }

    // calls on destroy the component
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // get events for for binding of select box
    getWebHooksEventsForSelectBox() {
        this.businessAccountService
            .getWebHooksEvents()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (resp: any) => {
                    this.events  = resp?.sort((a, b) => a?.localeCompare(b));
                },
            });
    }

    // Get previous Web Hooks for patching to form
    getWEbHooks(env) {
        this.isLoading.next(true);
        this.businessAccountService
            .getWebHooks(env)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (resp: any) => {
                    this.webHookForm.patchValue({
                        environment: env,
                        webHookUrl: resp.webHookUrl,
                        events: resp.events,
                    });
                    this.isLoading.next(false);
                },
                error: (err) => {
                    this.isLoading.next(false);
                },
            });
    }

    // remove dot and add space in select options
    replaceDotWithSpace(inputItem) {
        return inputItem.replace('.', ' ');
    }

    toggleDrawer() {
        this.accountComponent.matDrawer.toggle();
    }

    // save the webHook
    onSubmit() {
        if (this.webHookForm.invalid) {
            this.webHookForm.markAllAsTouched();
        } else {
            this.isLoading.next(true);
            this.businessAccountService
                .saveWebHooks(this.webHookForm.value)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe({
                    next: (resp) => {
                        this.isLoading.next(false);
                        this.router.navigateByUrl(
                            '/admin/business-account/edit/webhooks'
                        );
                        SWALMIXIN.fire({
                            icon: 'success',
                            title: 'Successfully Saved',
                        });
                    },
                    error: (err) => {
                        this.isLoading.next(false);
                        SWALMIXIN.fire({
                            icon: 'error',
                            title: err?.error?.message || err.message,
                        });
                    },
                });
        }
    }
}
