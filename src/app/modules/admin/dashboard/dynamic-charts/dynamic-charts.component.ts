import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};


@Component({
    selector: 'app-dynamic-charts',
    templateUrl: './dynamic-charts.component.html',
    styleUrls: ['./dynamic-charts.component.scss'],
})
export class DynamicChartsComponent implements OnInit,AfterViewInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input() chartData: any;


  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
    console.log("chart dta : ",this.chartData);

    this.chartOptions = {
      series:this.chartData?.chartSeries,
      chart: {
        height: 350,
        width:900,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Product Trends by Month",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: this.chartData?.x_axis,
    };
    
  }
  constructor() {
  }
}
