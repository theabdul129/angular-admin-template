import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'stores',
    templateUrl: './store.component.html'
})
export class StoresComponent {

    title = 'Stores | bsktpay';
    constructor( private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
  }
}