import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LauncherSettingsComponent } from './launcher-settings.component';

describe('LauncherSettingsComponent', () => {
  let component: LauncherSettingsComponent;
  let fixture: ComponentFixture<LauncherSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LauncherSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LauncherSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
