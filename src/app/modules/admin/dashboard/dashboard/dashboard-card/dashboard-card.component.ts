import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent {

  @Input() cardTitle:string;
  @Input() totalValue:number;
  @Input() totalValueLabel:string;
  @Input() subTitle:string;
  @Input() subTitleValue:number;
  @Input() cardColor:string;
}
