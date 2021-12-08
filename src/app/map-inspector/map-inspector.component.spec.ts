import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapInspectorComponent } from './map-inspector.component';

describe('MapInspectorComponent', () => {
  let component: MapInspectorComponent;
  let fixture: ComponentFixture<MapInspectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapInspectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
