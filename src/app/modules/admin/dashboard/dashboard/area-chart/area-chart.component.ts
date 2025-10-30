import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-area-chart',
    templateUrl: './area-chart.component.html',
    styleUrls: ['./area-chart.component.scss'],
})
export class AreaChartComponent {
    @Input() chartData: { series: any; labels: any };
    @Input() chartType: 'line' = 'line';
    public chartOptions: any;

    constructor() {}

    ngOnInit(): void {
        console.log('chart data: ', this.chartData);
        this.prepareChart();
    }

    prepareChart() {
        this.chartOptions = {
            series: [
                {
                    data: this.chartData?.series,
                },
            ],
            chart: {
              fontFamily: 'inherit',
              foreColor: 'inherit',
              height: '100%',
              type: this.chartType,
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
            stroke: {
                curve: 'straight',
            },
            labels: this.chartData?.labels,
            xaxis: {
                type: 'any',
            },
            yaxis: {
                opposite: true,
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
        };
    }
}
