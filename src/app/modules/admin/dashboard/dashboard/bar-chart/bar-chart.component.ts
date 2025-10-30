import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";

@Component({
  selector: "app-bar-chart",
  templateUrl: "./bar-chart.component.html",
  styleUrls: ["./bar-chart.component.scss"],
})
export class BarChartComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  @Input() chartData;

  public chartOptions: any;

  constructor() {}

  ngOnInit(): void {
    this.prepareChart();
  }

  prepareChart() {
  //  debugger;
    this.chartOptions = {
      series: this.chartData?.data.datasets,
      chart: {
        fontFamily: "inherit",
        foreColor: "inherit",
        width: "100%",
        type: this.chartData.type,
      },
      plotOptions: {
        ...this.chartData.data.options,
        bar: {
          borderRadius: 4,
        },
      },
      labels: this.chartData?.data.labels,
    };
    console.log("bar", this.chartOptions);
  }
}
