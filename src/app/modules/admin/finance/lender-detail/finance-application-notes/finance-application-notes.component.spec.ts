import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceApplicationNotesComponent } from './finance-application-notes.component';

describe('FinanceApplicationNotesComponent', () => {
  let component: FinanceApplicationNotesComponent;
  let fixture: ComponentFixture<FinanceApplicationNotesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinanceApplicationNotesComponent]
    });
    fixture = TestBed.createComponent(FinanceApplicationNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
