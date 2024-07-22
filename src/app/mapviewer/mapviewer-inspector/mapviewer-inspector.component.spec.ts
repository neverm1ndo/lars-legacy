import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapViewerInspectorComponent } from './mapviewer-inspector.component';

describe('MapViewerInspectorComponent', () => {
  let component: MapViewerInspectorComponent;
  let fixture: ComponentFixture<MapViewerInspectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapViewerInspectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapViewerInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
