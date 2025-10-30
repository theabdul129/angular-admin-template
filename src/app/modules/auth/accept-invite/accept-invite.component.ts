import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-accept-invite',
  templateUrl: './accept-invite.component.html',
  styleUrls: ['./accept-invite.component.scss']
})
export class AcceptInviteComponent implements OnInit {

  title = 'Accept Invitation | bsktpay';

  constructor(
    public auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) { }


  ngOnInit(): void {
    this.titleService.setTitle(this.title);
  }

  loginWithRedirect(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const organization = params.organization;
      const invitation = params.invitation;
      this.auth.loginWithRedirect();
    });
  }

}
