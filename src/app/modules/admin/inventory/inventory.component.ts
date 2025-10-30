import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'inventory',
    templateUrl: './inventory.component.html'
})
export class InventoryComponent {

    title = 'Products | bsktpay';
    constructor( private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
  }
}