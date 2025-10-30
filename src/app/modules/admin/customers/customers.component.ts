import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html'
})
export class CustomersComponent {
    title = 'Customers | bsktpay';
    constructor( private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
  }

}