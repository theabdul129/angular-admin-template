import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CustomerDetailComponent } from '../customer-detail.component';
import { Router } from '@angular/router';
import { CustomerService } from '../../customer.service';
import { takeUntil } from 'rxjs/operators';
import { BasicActions } from 'app/shared/basic-actions';

@Component({
  selector: 'app-affordability',
  templateUrl: './affordability.component.html',
  styleUrls: ['./affordability.component.scss']
})
export class AffordabilityComponent extends BasicActions implements OnInit,OnDestroy {
  customerId: any;
  affordabilityData: any;
  
  constructor(private customerComponent: CustomerDetailComponent, private route: Router,
    private customerService: CustomerService,  private cdr: ChangeDetectorRef) { 
      super(customerComponent)
    }
  
  ngOnInit(): void {
    if(window.innerWidth<769)this.toggleDrawer();
    let id = this.route.url.split(['/'][0]);
    this.customerId = id[3];
    this.getAffordability()
  }

  getAffordability() {
    this.loading(true);
    this.customerService.getAffordability(this.customerId)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe({
      next: (resp) => {       
        this.loading(false);
        this.affordabilityData = resp;
        this.detectChanges();
      },
      error: (err) => {
        this.loading(false);
        this.detectChanges()
      },
    });
  }

  detectChanges(){
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
