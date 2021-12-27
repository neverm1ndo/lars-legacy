import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsSettingsComponent } from './alerts-settings.component';

describe('AlertsSettingsComponent', () => {
  let component: AlertsSettingsComponent;
  let fixture: ComponentFixture<AlertsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertsSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
