import { Component, OnInit } from '@angular/core';
import { AccountDetailComponent } from '../account-detail.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-web-hooks',
    templateUrl: './web-hooks.component.html',
    styleUrls: ['./web-hooks.component.scss'],
})
export class WebHooksComponent implements OnInit {
    constructor(
        private accountComponent: AccountDetailComponent,
        private router: Router
    ) {}

    ngOnInit(): void {
        if(window.innerWidth<769)this.toggleDrawer();
    }

    toggleDrawer() {
        this.accountComponent.matDrawer.toggle();
    }

    goToForm(env) {
        this.router.navigateByUrl(
            '/admin/business-account/edit/webhooks/' + env
        );
    }
}
