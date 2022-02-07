import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerStatGraphComponent } from './server-stat-graph.component';

describe('ServerStatGraphComponent', () => {
  let component: ServerStatGraphComponent;
  let fixture: ComponentFixture<ServerStatGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerStatGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerStatGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
