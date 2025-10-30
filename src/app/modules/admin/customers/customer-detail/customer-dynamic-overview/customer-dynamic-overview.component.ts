import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-customer-dynamic-overview',
    templateUrl: './customer-dynamic-overview.component.html',
    styleUrls: ['./customer-dynamic-overview.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CustomerDynamicOverviewComponent {
  @Input() customerDetail;
  removeUnderScore(str : String){
    if(!str) return '';
    return str?.replace(/_/g, ' ');
  }
}
