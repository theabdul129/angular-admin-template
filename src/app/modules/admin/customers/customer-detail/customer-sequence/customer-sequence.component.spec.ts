import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSequenceComponent } from './customer-sequence.component';

describe('CustomerSequenceComponent', () => {
  let component: CustomerSequenceComponent;
  let fixture: ComponentFixture<CustomerSequenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerSequenceComponent]
    });
    fixture = TestBed.createComponent(CustomerSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
