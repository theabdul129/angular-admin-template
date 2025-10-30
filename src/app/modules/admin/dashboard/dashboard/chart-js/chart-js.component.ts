import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Chart, BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, registerables} from 'chart.js';

@Component({
  selector: 'app-chart-js',
  templateUrl: './chart-js.component.html',
  styleUrls: ['./chart-js.component.scss']
})
export class ChartJsComponent implements OnInit, AfterViewInit{
  myChart: any;

  @Input() chartOptions:any;
  @Input() divId:any;
 
  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {    
    const chartContext = Chart.getChart(this.divId);    
    if (chartContext !== undefined) {
      chartContext.destroy();
    }

    this.loadBarChart();
  }

  ngOnInit(): void {
  }

  loadBarChart() {
    let ele:any=document.getElementById(this.divId);
    this.myChart = new Chart(ele,this.chartOptions );
  }
}
