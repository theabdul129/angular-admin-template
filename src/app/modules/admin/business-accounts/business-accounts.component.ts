import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'businessAccounts',
    templateUrl: './business-accounts.component.html'
})
export class BusinessAccountsComponent {

    title = 'Business Account | bsktpay';
    constructor( private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
  }
}