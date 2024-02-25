import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerlogMonitorComponent } from './serverlog-monitor.component';

describe('ServerlogMonitorComponent', () => {
  let component: ServerlogMonitorComponent;
  let fixture: ComponentFixture<ServerlogMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServerlogMonitorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ServerlogMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
