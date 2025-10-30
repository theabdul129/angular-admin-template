import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebHookFormComponent } from './web-hook-form.component';

describe('WebHookFormComponent', () => {
  let component: WebHookFormComponent;
  let fixture: ComponentFixture<WebHookFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebHookFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebHookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
