import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'product-manufacturer',
    templateUrl: './product-manufacturer.component.html'
})
export class ProductManufacturerComponent {

    title = 'Product Manufacturers | bsktpay';
    constructor( private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
  }
}