import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperAppsFormComponent } from './developer-apps-form.component';

describe('DeveloperAppsFormComponent', () => {
  let component: DeveloperAppsFormComponent;
  let fixture: ComponentFixture<DeveloperAppsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeveloperAppsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeveloperAppsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
