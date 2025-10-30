import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentApplicationComponent } from './consent-application.component';

describe('ConsentApplicationComponent', () => {
  let component: ConsentApplicationComponent;
  let fixture: ComponentFixture<ConsentApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsentApplicationComponent]
    });
    fixture = TestBed.createComponent(ConsentApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
