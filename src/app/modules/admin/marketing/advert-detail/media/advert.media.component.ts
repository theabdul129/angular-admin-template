import { Component, NgZone, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AdvertDetailComponent } from '../advert-detail.component';

import { AdvertService } from '../../advert.service';
import { Advert } from 'app/models/advert';
import { Location } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'advert-media',
    templateUrl: './advert.media.component.html',
})
export class AdvertMediaComponent implements OnInit {
    userForm: UntypedFormGroup;

    isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
    panelOpenState = false;
    selectedAdvert: Advert;
    advertId: any;
    contentType = 'advert';

    constructor(
        private route: Router,
        public dialog: MatDialog,
        private advertDetailComponent: AdvertDetailComponent,
        private advertService: AdvertService,
        private location: Location,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        let id = this.route.url.split(['/'][0]);
        this.advertId = Number(id[4]);

        if (this.advertId) this.load();
    }

    load() {
        this.isLoading.next(true);
        this.advertService
            .get(this.advertId)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            )
            .subscribe((data) => {
                this.selectedAdvert = data;
                if (!data.mediaUrl) {
                    this.selectedAdvert.mediaUrl = data.imageUrl;
                    this.selectedAdvert.publicMediaUrl = data.publicImageUrl;
                }
            });
    }

    toggleDrawer() {
        this.advertDetailComponent.matDrawer.toggle();
    }

    onSubmit(fileName) {
        this.selectedAdvert = {
            ...this.selectedAdvert,
            mediaUrl: fileName,
        };

        this.advertService
            .saveImage(this.selectedAdvert, this.advertId)
            .pipe(
                finalize(() => {
                    this.isLoading.next(false);
                })
            )
            .subscribe((data) => {
                this.selectedAdvert = data;

                if (!data.mediaUrl) {
                    this.selectedAdvert.mediaUrl = data.imageUrl;
                    this.selectedAdvert.publicMediaUrl = data.publicImageUrl;
                }
            });
    }
}
