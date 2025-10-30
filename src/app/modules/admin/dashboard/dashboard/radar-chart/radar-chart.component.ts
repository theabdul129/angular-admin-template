import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-radar-chart',
    templateUrl: './radar-chart.component.html',
    styleUrls: ['./radar-chart.component.scss'],
})
export class RadarChartComponent {
    @Input() chartData: { series: any; labels: any };
    @Input() chartType: 'line' = 'line';
    public chartOptions: any;

    constructor() {}

    ngOnInit(): void {
      console.log("chat data in radar: ",this.chartData);
      
        this.prepareChart();
    }

    prepareChart() {
      this.chartOptions = {
        chart: {
            fontFamily: 'inherit',
            foreColor: 'inherit',
            width: '100%',
            type: 'radar',
            sparkline: {
                enabled: true,
            },
        },
        colors: ['#818CF8'],
        dataLabels: {
            enabled: true,
            formatter: (val: number): string | number => `${val}%`,
            textAnchor: 'start',
            style: {
                fontSize: '13px',
                fontWeight: 500,
            },
            background: {
                borderWidth: 0,
                padding: 4,
            },
            offsetY: -15,
        },
        markers: {
            strokeColors: '#818CF8',
            strokeWidth: 4,
        },
        plotOptions: {
            radar: {
                polygons: {
                    strokeColors: 'var(--fuse-border)',
                    connectorColors: 'var(--fuse-border)',
                },
            },
        },
        // series: this.chartData?.series,
        series: [
          {
            name: "series 1",
            data: this.chartData?.series,
          }
        ],
        stroke: {
            width: 2,
        },
        tooltip: {
            theme: 'dark',
        },
        xaxis: {
            labels: {
                show: true,
                style: {
                    fontSize: '12px',
                    fontWeight: '500',
                },
            },
            categories: this.chartData?.labels,
        },
        yaxis: {
            max: (max: number): number =>
                parseInt((max + 10).toFixed(0), 10),
            tickAmount: 7,
        },
    };
    }
}
