import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyResourceComponent } from './third-party-resource.component';

describe('ThirdPartyResourceComponent', () => {
  let component: ThirdPartyResourceComponent;
  let fixture: ComponentFixture<ThirdPartyResourceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThirdPartyResourceComponent]
    });
    fixture = TestBed.createComponent(ThirdPartyResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
