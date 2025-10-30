import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-funnel-chart',
  templateUrl: './funnel-chart.component.html',
  styleUrls: ['./funnel-chart.component.scss']
})
export class FunnelChartComponent implements OnInit {
  @Input() chartData: { series: any; labels: any };
  @Input() chartType: 'bar' = 'bar';
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions;

  ngOnInit(): void {
    console.log("chart data in funnelL ",this.chartData);
    
    this.chartOptions = {
      series: [
        {
          name: "Funnel Series",
          data: this.chartData?.series
        }
      ],
      chart: {
        width:"100%",
        fontFamily: 'inherit',
        foreColor: 'inherit',
        // height: '100%',
        type: this.chartType,
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false,
        },
        // type: "bar",
        // height: 350
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          horizontal: true,
          barHeight: "80%",
          isFunnel: true
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
        },
        dropShadow: {
          enabled: true
        }
      },
      // title: {
      //   text: "Recruitment Funnel",
      //   align: "center"
      // },
      xaxis: {
        categories: this.chartData?.labels
      },
      legend: {
        show: false
      },
      theme: {
        monochrome: {
            enabled: true,
            color: '#93C5FD',
            // color: '#93C5FD',
            shadeIntensity: 0.75,
            shadeTo: 'dark',
        },
      },
      fill: {
        opacity: 1,
      },
      grid: {
        borderColor: 'var(--fuse-border)',
      },
    }
  }
  constructor() {
  }
}
