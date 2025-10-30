import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionOverviewComponent } from './decision-overview.component';

describe('DecisionOverviewComponent', () => {
  let component: DecisionOverviewComponent;
  let fixture: ComponentFixture<DecisionOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecisionOverviewComponent]
    });
    fixture = TestBed.createComponent(DecisionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
