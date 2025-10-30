import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';

@Component({
    selector: 'app-radial-bar-chart',
    templateUrl: './radial-bar-chart.component.html',
    styleUrls: ['./radial-bar-chart.component.scss'],
})
export class RadialBarChartComponent implements OnInit {
    @ViewChild('chart') chart: ChartComponent;
    @Input() chartData: { series: any; labels: any };
    @Input() chartType: 'radialBar' = 'radialBar';
    public chartOptions: any;

    constructor() {}

    ngOnInit(): void {
        this.prepareChart();
    }

    prepareChart() {


        this.chartOptions = {
            series: this.chartData?.series,
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                width: '100%',
                type: this.chartType,
                sparkline: {
                    enabled: true,
                },
            },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: {
                            fontSize: '22px',
                        },
                        value: {
                            fontSize: '16px',
                        },
                    },
                },
            },
            labels: this.chartData?.labels,
        };
    }
}
