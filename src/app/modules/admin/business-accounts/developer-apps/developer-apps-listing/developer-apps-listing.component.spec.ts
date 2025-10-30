import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperAppsListingComponent } from './developer-apps-listing.component';

describe('DeveloperAppsListingComponent', () => {
  let component: DeveloperAppsListingComponent;
  let fixture: ComponentFixture<DeveloperAppsListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeveloperAppsListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeveloperAppsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
