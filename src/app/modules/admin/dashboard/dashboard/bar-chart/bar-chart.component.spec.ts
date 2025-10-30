import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadialBarChartComponent } from './bar-chart.component';

describe('RadialBarChartComponent', () => {
  let component: RadialBarChartComponent;
  let fixture: ComponentFixture<RadialBarChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RadialBarChartComponent]
    });
    fixture = TestBed.createComponent(RadialBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
