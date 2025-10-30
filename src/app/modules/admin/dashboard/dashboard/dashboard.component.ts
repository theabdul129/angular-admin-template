import { Component, OnInit } from "@angular/core";
import { DashboardsService } from "../home.service";
import { DashboardService } from "./dashboard.service";
import { ApexOptions } from "ng-apexcharts";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  dashboardCardsData;
  data;
  chartData;
  chartGithubIssues: ApexOptions = {};
  chartTaskDistribution: ApexOptions = {};
  chartBudgetDistribution: ApexOptions = {};
  chartWeeklyExpenses: ApexOptions = {};
  chartMonthlyExpenses: ApexOptions = {};
  chartYearlyExpenses: ApexOptions = {};
  selectedProject: string = "";
  id;
  dashboardData;
  charts;
  tables;
  cards;
  customers;
  dynamicTables=[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  dropDownValues: [];
  constructor(private dashboardService: DashboardService, private _router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.id = paramMap.get("id");

      this.getDashboards();
      this.getDashboardData(this.id);
      this.getDashboardChartsData(this.id);
      this.getProjectData();
      this.getDashboardCustomers(this.id);
    });

    window["Apex"] = {
      chart: {
        events: {
          mounted: (chart: any, options?: any): void => {
            this._fixSvgFill(chart.el);
          },
          updated: (chart: any, options?: any): void => {
            this._fixSvgFill(chart.el);
          },
        },
      },
    };
  }

  dashboard(id) {
    this._router.navigateByUrl(`/admin/home/dashboard/${id}`);
  }

  getDashboards() {
    this.dashboardService.getAllDashboards().subscribe({
      next: (resp: any) => {
        this.dropDownValues = resp.map((s) => ({ label: s.name.replace(/"/g, ""), value: s.id }));
      },
      error: (err) => {
        console.log("got error : ", err);
      },
    });
  }

  getDashboardData(id) {
    this.dashboardService.getDashboard(id).subscribe({
      next: (resp: any) => {
        this.dashboardData = resp;

        this.selectedProject = resp.name.replace(/"/g, "");
      },
      error: (err) => {
        console.log("got error : ", err);
      },
    });
  }


  getDashboardCustomers(id) {
    this.dashboardService.getDashboardCustomers(id).subscribe({
      next: (resp: any) => {
        this.customers = resp;


      },
      error: (err) => {
        console.log("got error : ", err);
      },
    });
  }



  
  getDashboardChartsData(id) {
    this.dashboardService.getDashboardCharts(id).subscribe({
      next: (resp: any) => {
        this.charts = resp
          .filter((s) => s.type == "chart")
          .map((s) => ({
            created_at: s.created_at,
            reasoning: s.reasoning,
            type: s.type,
            data: this.stringToObject(s.data),
          }));

        this.createDynamicTables(resp
          .filter((s) => s.type == "table"))  

        this.cards = resp.filter((s) => s.type == "card")
      },
      error: (err) => {
        console.log("got error : ", err);
      },
    });
  }

  createDynamicTables(rawData) {
    let singleTable: any;
    for (let item of rawData) {
        let data = [];
        if (item?.data?.data?.labels) {
            data.push(item?.data?.data?.datasets[0].data);
            singleTable = {
                labels: item?.data?.data?.labels,
                data,
            };
            this.dynamicTables.push(singleTable);
        }
    }
  }

  stringToObject(str) {
    try {
      // Create a new function that returns the object
      const fn = new Function("return " + str);
      return fn();
    } catch (e) {
      console.error("The string cannot be converted to a valid JavaScript object:", e);
      return null;
    }
  }

  getProjectData() {
    this.dashboardService.projectData.subscribe({
      next: (resp) => {
        this.data = resp;
      },
      error: (err) => {
        console.log("got error : ", err);
      },
    });
  }

  getChartsData() {
    this.dashboardService.chartData.subscribe({
      next: (resp) => {
        this.chartData = resp;
      },
      error: (err) => {
        console.log("got error : ", err);
      },
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Fix the SVG fill references. This fix must be applied to all ApexCharts
   * charts in order to fix 'black color on gradient fills on certain browsers'
   * issue caused by the '<base>' tag.
   *
   * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
   *
   * @param element
   * @private
   */
  private _fixSvgFill(element: Element): void {
    // Current URL
    const currentURL = this._router.url;

    // 1. Find all elements with 'fill' attribute within the element
    // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
    // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
    Array.from(element.querySelectorAll("*[fill]"))
      .filter((el) => el.getAttribute("fill").indexOf("url(") !== -1)
      .forEach((el) => {
        const attrVal = el.getAttribute("fill");
        el.setAttribute("fill", `url(${currentURL}${attrVal.slice(attrVal.indexOf("#"))}`);
      });
  }

  // labels: this.data.taskDistribution.labels,
  //         legend: {
  //             position: 'bottom',
  //         },
  //         plotOptions: {
  //             polarArea: {
  //                 spokes: {
  //                     connectorColors: 'var(--fuse-border)',
  //                 },
  //                 rings: {
  //                     strokeColor: 'var(--fuse-border)',
  //                 },
  //             },
  //         },
  // series: ,

  polarChartJs = undefined;
  selectChart(chartType: "mixed" | "pie") {
    // if(chartType=='mixed'){
    //     this.addChart.mixedChart=!this.addChart.mixedChart;
    // }
    // if(chartType=='pie'){
    //     this.addChart.pieChart=!this.addChart.pieChart
    // }
  }
}
