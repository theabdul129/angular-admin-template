import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { BasicActions } from "app/shared/basic-actions";
import { takeUntil, filter } from "rxjs/operators";
import { FinanceService } from "../finance.service";
import { SWALMIXIN } from "app/core/services/mixin.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-profile-details",
  templateUrl: "./profile-details.component.html",
  styleUrls: ["./profile-details.component.scss"],
})
export class ProfileDetailsComponent extends BasicActions implements OnInit, OnDestroy {
  profile: any;
  @Input() id: number;
  selectedId: number;
  lenderEnabled: boolean = false;
  beneficiaryOrder: string;
  constructor(private route: Router, private financeService: FinanceService) {
    super("");
  }

  ngOnInit(): void {
    let id = this.route.url.split(["/"][0]);
    this.selectedId = Number(id[4]);
    this.getSelectedLender();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  getSelectedLender(){
    this.loading(true);
    this.financeService.lenderData
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (data) => {
          this.loading(false);
          this.profile = data;
          this.beneficiaryOrder = data?.beneficiaryOrder ? data.beneficiaryOrder.toString() : "null";
          this.lenderEnabled = data?.merchantEnabled;
        },
        (error) => {
          this.loading(false);
        }
      );
  }

  saveRouting() {
    let payload = {};

    payload = {
      merchantEnabled: this.lenderEnabled,
      beneficiaryOrder: Number(this.beneficiaryOrder),
    };
    this.isLoading.next(true);
    this.financeService
      .saveMerchantLenders(payload, this.selectedId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (resp) => {
          this.isLoading.next(false);
          SWALMIXIN.fire({
            icon: "success",
            title: "Routing saved successfully",
          });
        },
        error: (err) => {
          this.isLoading.next(false);
          SWALMIXIN.fire({
            icon: "error",
            title: err?.error?.message || err?.message,
          });
        },
      });
  }
}
