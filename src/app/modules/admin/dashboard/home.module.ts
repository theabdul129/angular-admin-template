import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Route, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { MaterialModule } from 'app/shared/material.module';
import { SharedModule } from 'app/shared/shared.module';
import { DynamicChartsComponent } from './dynamic-charts/dynamic-charts.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartJsComponent } from './dashboard/chart-js/chart-js.component';
import { DashboardCardComponent } from './dashboard/dashboard-card/dashboard-card.component';
import { PieChartComponent } from './dashboard/pie-chart/pie-chart.component';
import { MixedChartComponent } from './dashboard/mixed-chart/mixed-chart.component';
import { RadialChartComponent } from './dashboard/radial-chart/radial-chart.component';
import { LineChartComponent } from './dashboard/line-chart/line-chart.component';
import { AreaChartComponent } from './dashboard/area-chart/area-chart.component';
import { ColumnChartComponent } from './dashboard/column-chart/column-chart.component';
import { FunnelChartComponent } from './dashboard/funnel-chart/funnel-chart.component';
import { RadarChartComponent } from './dashboard/radar-chart/radar-chart.component';
import { RadialBarChartComponent } from './dashboard/radial-bar-chart/radial-bar-chart.component';
import { BarChartComponent } from './dashboard/bar-chart/bar-chart.component';
import { DynamicTableComponent } from './dashboard/dynamic-table/dynamic-table.component';


const routes: Route[] = [
  {
      path: '',
      component:HomeComponent
  },
  
  {
    path: 'dashboard/:id',
    component:DashboardComponent
}
  ,
];

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    DynamicChartsComponent,
    ChartJsComponent,
    DashboardCardComponent,
    PieChartComponent,
    MixedChartComponent,
    RadialChartComponent,
    LineChartComponent,
    AreaChartComponent,
    ColumnChartComponent,
    FunnelChartComponent,
    RadarChartComponent,
    RadialBarChartComponent,
    BarChartComponent,
    DynamicTableComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FuseAlertModule,
    SharedModule,
    NgApexchartsModule
  ]
})
export class DashboardModule { }
