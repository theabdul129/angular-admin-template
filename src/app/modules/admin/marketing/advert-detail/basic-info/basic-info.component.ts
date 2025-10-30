import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SWALMIXIN } from 'app/core/services/mixin.service';
import { Location } from '@angular/common';
import { AdvertDetailComponent } from '../advert-detail.component';
import { AdvertService } from '../../advert.service';
import { finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
    selector: 'basic-advertDetail',
    templateUrl: './basic-info.component.html',
})
export class AdvertBasicDetailComponent implements OnInit {
    advertId: any;
    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();

    form: UntypedFormGroup;
    selectedAdvert;
    formSubmitted: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: Router,
        private dialog: MatDialog,
        private advertComponent: AdvertDetailComponent,
        private location: Location,
        private advertService: AdvertService,
    ) {
        this.form = this.formBuilder.group({
            name: ['', Validators.compose([Validators.required])],
            contentType: '',
            contentLocation: '',
            title: '',
            description: '',
            body: ['', Validators.compose([Validators.required])],
            promotionCode: '',
            callToActionParams: '',
            callToActionUrl: '',
            callToActionStack: '',
            callToActionLabel: '',
            actionType: '',
            actionParams: '',
            displayedDateFrom: '',
            displayedDateTo: '',
            orderPosition: '',
            errorCode: '',
        });
    }

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.advertId = Number(id[4]);
        if (this.advertId) this.loadAdvert();
    }

    loadAdvert() {
        this.isLoading.next(true);
        this.advertService
            .get(this.advertId)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            )
            .subscribe(
                (data) => {
                    this.selectedAdvert = data;
                    this.form.patchValue({
                        name: data.name,
                        contentType: data.contentType,
                        contentLocation: data.contentLocation,
                        title: data.title,
                        description: data.description,
                        body: data.body,
                        callToActionLabel: data.callToActionLabel,
                        actionType: data.actionType,
                        actionParams: data.actionParams,
                        displayedDateFrom: data.displayedDateFrom,
                        displayedDateTo: data.displayedDateTo,
                        orderPosition: data.orderPosition,
                        errorCode: data.errorCode,
                        mediaUrl: data.mediaUrl,
                    });
                },
                (error) => {
                    false;
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                }
            );
    }

    onSubmit() {
        if (this.advertId) this.updateAdvert();
        else this.createAdvert();
    }

    createAdvert() {
        this.formSubmitted = true;
        if(this.form.invalid) return;
        this.isLoading.next(true);
        this.form.value.id = 0;
        this.advertService
            .create(this.form.value)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            ).subscribe(
                (data: any) => {
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Your advert details have been saved.',
                    });
                    this.route.navigate(['/admin/marketing/adverts/', data.body.id]);
                }, (error) => {
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                }
            );
    }

    updateAdvert() {
        this.formSubmitted = true;
        if(this.form.invalid) return;
        this.isLoading.next(true);

        this.advertService
            .save(this.form.value, this.advertId)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            )
            .subscribe(
                (data: any) => {
                    if (data.status != 200) return;
                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Your advert has been updated.',
                    });
                },
                (error) => {
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                }
            );
    }

    toggleDrawer() {
        this.advertComponent.matDrawer.toggle();
    }

    publish() {
        this.isLoading.next(true);
        this.advertService
            .publish(this.selectedAdvert.id)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            )
            .subscribe(
                (data) => {
                    this.closeModal();

                    this.selectedAdvert = data;

                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Published successfuly.',
                    });
                },
                (error) => {
                    this.closeModal();
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
                    });
                }
            );
    }

    unpublish() {
        this.isLoading.next(true);
        this.advertService
            .unpublish(this.selectedAdvert.id)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            )
            .subscribe(
                (data) => {
                    this.closeModal();
                    if (data.status != 200) return;
                    this.selectedAdvert = data.body;

                    SWALMIXIN.fire({
                        icon: 'success',
                        title: 'Unpublished successfuly.',
                    });
                },
                (error) => {
                    this.closeModal();
                    SWALMIXIN.fire({
                        icon: 'error',
                        title: error.error.errorMessage,
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
