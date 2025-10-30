import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from '@auth0/auth0-angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {

    isLoggedIn = false;

    constructor(
        public auth: AuthService,
        private ruter: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params) => {
            const invitation = params;
            if(invitation.invitation) {this.ruter.navigate(['/invitation'], {queryParams: invitation});}
          });
    }

    signIn() {
        if (this.auth.isAuthenticated$) {this.ruter.navigateByUrl('admin/home');}
    }
}
