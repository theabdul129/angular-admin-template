import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressDropDownComponent } from './address-drop-down.component';

describe('AddressDropDownComponent', () => {
  let component: AddressDropDownComponent;
  let fixture: ComponentFixture<AddressDropDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressDropDownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
