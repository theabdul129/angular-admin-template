import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'product-brands',
    templateUrl: './product-brand.component.html'
})
export class ProductBrandsComponent {

    title = 'Product Brands | bsktpay';
    constructor( private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
  }
}