import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveDeliveryAddressComponent } from './save-delivery-address.component';

describe('SaveDeliveryAddressComponent', () => {
  let component: SaveDeliveryAddressComponent;
  let fixture: ComponentFixture<SaveDeliveryAddressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaveDeliveryAddressComponent]
    });
    fixture = TestBed.createComponent(SaveDeliveryAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
