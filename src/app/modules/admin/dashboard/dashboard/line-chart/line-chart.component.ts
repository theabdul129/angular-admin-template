import { Component, Input } from '@angular/core';
import { ChartOptions } from 'chart.js';

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent {
    @Input() chartData: { series: any; labels: any };
    @Input() chartType: 'line' = 'line';
    public chartOptions: any;

    constructor() {}

    ngOnInit(): void {
        this.prepareChart();
    }

    prepareChart() {
        this.chartOptions = {
            series: [
                {
                    data: this.chartData?.series,
                }
            ],
            chart: {
                width: '100%',
                type: this.chartType,
                fontFamily: 'inherit',
                foreColor: 'inherit',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            dataLabels: {
                enabled: false,
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
                curve: 'straight',
            },
            grid: {
                row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.5,
                },
            },
            xaxis: {
                categories: this.chartData?.labels,
                labels: {
                  style: {
                      colors: 'var(--fuse-text-secondary)',
                  },
              },
            },
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
