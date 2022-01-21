import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsSettingsComponent } from './notifications-settings.component';

describe('AlertsSettingsComponent', () => {
  let component: NotificationsSettingsComponent;
  let fixture: ComponentFixture<NotificationsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationsSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
