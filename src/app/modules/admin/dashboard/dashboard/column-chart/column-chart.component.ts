import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-column-chart',
    templateUrl: './column-chart.component.html',
    styleUrls: ['./column-chart.component.scss'],
})
export class ColumnChartComponent implements OnInit {
    @Input() chartData: { series: any; labels: any };
    @Input() chartType: 'bar' = 'bar';
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
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded',
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent'],
            },
            xaxis: {
                categories: this.chartData?.labels,
            },
            yaxis: {
                title: {
                },
            },
            fill: {
                opacity: 1,
            },
            theme: {
                monochrome: {
                    enabled: true,
                    color: '#93C5FD',
                    shadeIntensity: 0.75,
                    shadeTo: 'dark',
                },
            },
        };
    }
}
