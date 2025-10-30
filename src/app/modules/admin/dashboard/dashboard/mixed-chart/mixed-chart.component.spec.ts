import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MixedChartComponent } from './mixed-chart.component';

describe('MixedChartComponent', () => {
  let component: MixedChartComponent;
  let fixture: ComponentFixture<MixedChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MixedChartComponent]
    });
    fixture = TestBed.createComponent(MixedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
