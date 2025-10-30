import { Component, OnInit } from "@angular/core";
import { DashboardsService } from "../home.service";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs/operators";

import { SWALMIXIN } from "app/core/services/mixin.service";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-home-dashboard",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  dashboardCardsData;
  goalIdeas;
  chartData;
  form: UntypedFormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoadingObs: Observable<boolean> = this.isLoading.asObservable();
  dashboardData

  constructor(private dashboardService: DashboardsService, private formBuilder: UntypedFormBuilder, private route: Router) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      query: [null, Validators.compose([Validators.required])],
    });
    this.getDashboardCardsData();
    this.getGoalIdeas();
  }


  getDashboardCardsData() {
    this.dashboardService.getAllDashboards().subscribe({
      next: (resp: any) => {
        this.dashboardData = resp;
        this.dashboardCardsData = resp
          .sort(function (a: any, b: any) {
            return  Date.parse(b.created_at) -  Date.parse(a.created_at);
          })
          .slice(0, 3);
      },
      error: (err) => {
        console.log("got error : ", err);
      },
    });
  }

  getGoalIdeas() {
    this.dashboardService.goalIdeas.subscribe({
      next: (resp) => {
        this.goalIdeas = resp;
      },
      error: (err) => {
        console.log("got error : ", err);
      },
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions

    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  onCreateDashboard(payload) {
    this.dashboardService
      .createDashboards(payload)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (data: any) => {
          this.loading(false);
          if (data.status != 200) return;
          SWALMIXIN.fire({
            icon: "success",
            title: "Your dashboard is being created.",
          });

          this.route.navigateByUrl(`/admin/home/dashboard/${data?.body?.id}`);
        },
        (error) => {
          this.loading(false);
          SWALMIXIN.fire({
            icon: "error",
            title: error.error.message,
          });
        }
      );
  }

  onSubmit() {
    if(this.form.invalid) return;

    const payload = {
      query: this.form.value.query,
    };

    this.onCreateDashboard(payload);
  }

  onSubmitOnClick(query) {
    const payload = {
      query: query,
    };

    this.onCreateDashboard(payload);
  }

  loading(loading: boolean) {
    this.isLoading.next(loading);
  }

  goToDasboard(id){
    this.route.navigateByUrl(`/admin/home/dashboard/${id}`);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
