import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicINvoiceComponent } from './public-invoice.component';

describe('PublicINvoiceComponent', () => {
  let component: PublicINvoiceComponent;
  let fixture: ComponentFixture<PublicINvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublicINvoiceComponent]
    });
    fixture = TestBed.createComponent(PublicINvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
