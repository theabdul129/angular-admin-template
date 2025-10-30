import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendNotificationOptionsComponent } from './send-notification-options.component';

describe('SendNotificationOptionsComponent', () => {
  let component: SendNotificationOptionsComponent;
  let fixture: ComponentFixture<SendNotificationOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendNotificationOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendNotificationOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
