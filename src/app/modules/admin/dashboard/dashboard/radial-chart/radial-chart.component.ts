import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-radial-chart',
    templateUrl: './radial-chart.component.html',
    styleUrls: ['./radial-chart.component.scss'],
})
export class RadialChartComponent implements OnInit {
    chartTaskDistribution: any;
    @Input() chartData: { series: any; labels: any };
    ngOnInit(): void {

      console.log("is the chart data avail: ",this.chartData);
      
        if (this.chartData) this.prepareChart();
    }
    prepareChart() {
        this.chartTaskDistribution = {
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'polarArea',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            labels: this.chartData.labels,
            legend: {
                position: 'bottom',
            },
            plotOptions: {
                polarArea: {
                    spokes: {
                        connectorColors: 'var(--fuse-border)',
                    },
                    rings: {
                        strokeColor: 'var(--fuse-border)',
                    },
                },
            },
            series: this.chartData.series,
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
