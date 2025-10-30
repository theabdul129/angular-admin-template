import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDynamicOverviewComponent } from './customer-dynamic-overview.component';

describe('CustomerDynamicOverviewComponent', () => {
  let component: CustomerDynamicOverviewComponent;
  let fixture: ComponentFixture<CustomerDynamicOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerDynamicOverviewComponent]
    });
    fixture = TestBed.createComponent(CustomerDynamicOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
