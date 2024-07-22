import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapViewerBarComponent } from './map-viewer-bar.component';

describe('MapViewerBarComponent', () => {
  let component: MapViewerBarComponent;
  let fixture: ComponentFixture<MapViewerBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapViewerBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapViewerBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
