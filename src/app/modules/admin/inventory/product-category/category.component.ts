import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'product-category',
    templateUrl: './category.component.html'
})
export class ProductCategoryComponent {

    title = 'Product Categories | bsktpay';
    constructor( private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
  }
}