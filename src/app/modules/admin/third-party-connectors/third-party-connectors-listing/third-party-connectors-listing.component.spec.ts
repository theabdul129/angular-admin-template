import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyConnectorsListingComponent } from './third-party-connectors-listing.component';

describe('ThirdPartyConnectorsListingComponent', () => {
  let component: ThirdPartyConnectorsListingComponent;
  let fixture: ComponentFixture<ThirdPartyConnectorsListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThirdPartyConnectorsListingComponent]
    });
    fixture = TestBed.createComponent(ThirdPartyConnectorsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
