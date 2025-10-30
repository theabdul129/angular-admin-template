import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceApplicationHistoryComponent } from './finance-application-history.component';

describe('FinanceApplicationHistoryComponent', () => {
  let component: FinanceApplicationHistoryComponent;
  let fixture: ComponentFixture<FinanceApplicationHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinanceApplicationHistoryComponent]
    });
    fixture = TestBed.createComponent(FinanceApplicationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
