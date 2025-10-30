import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { BooleanInput } from "@angular/cdk/coercion";
import { AuthService } from "@auth0/auth0-angular";
import { Router } from "@angular/router";

@Component({
  selector: "user",
  templateUrl: "./user.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: "user",
})
export class UserComponent implements OnInit {
  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_showAvatar: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  @Input() showAvatar: boolean = true;

  constructor(public auth: AuthService, private route: Router) {}

  ngOnInit() {}

  signOut() {
    this.auth.logout();
  }

  goEdit() {
    this.route.navigate(["/admin/users/current"]);
  }
}
