import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';

import {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
} from 'ng-apexcharts';

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    legend: any;
    states:any;
    stroke:any;
    theme:any;
    tooltip:any;
    yaxis
};

@Component({
    selector: 'app-pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit {
    @Input() chartData: { series: any; labels: any };
    @Input() chartType: 'pie'|'donut' ='pie';
    public chartOptions: Partial<ChartOptions>;

    constructor() {}

    ngOnInit(): void {
      this.prepareChart();
    }

    prepareChart() {
        this.chartOptions = {
            series: this.chartData?.series,
            chart: {
                width: '100%',
                type: 'line',
                // type: this.chartType,
                fontFamily: 'inherit',
                foreColor: 'inherit',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            legend: {
                position: 'bottom',
            },
            states: {
                hover: {
                    filter: {
                        type: 'darken',
                        value: 0.75,
                    },
                },
            },
            stroke: {
                width: 2,
            },

            labels: this.chartData?.labels,
            theme: {
              monochrome: {
                  enabled: true,
                  color: '#93C5FD',
                  shadeIntensity: 0.75,
                  shadeTo: 'dark',
              },
          },
          tooltip: {
              followCursor: true,
              theme: 'dark',
          },
          yaxis: {
              labels: {
                  style: {
                      colors: 'var(--fuse-text-secondary)',
                  },
              },
          },
        };
    }
}
