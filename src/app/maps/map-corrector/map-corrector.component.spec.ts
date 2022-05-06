import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapCorrectorComponent } from './map-corrector.component';

describe('MapCorrectorComponent', () => {
  let component: MapCorrectorComponent;
  let fixture: ComponentFixture<MapCorrectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapCorrectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapCorrectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
