import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { MapEditorComponent } from "./map-editor.component";
import { ElementRef, Injectable } from "@angular/core";

@Injectable()
export class MockElementRef {
  nativeElement: {
    width: 100;
    height: 100;
    offsetWidth: 100;
    offsetHeight: 100;
  };
}

describe("MapEditorComponent", () => {
  let component: MapEditorComponent;
  let fixture: ComponentFixture<MapEditorComponent>;

  let fakeElem: ElementRef;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MapEditorComponent],
      providers: [{ provide: ElementRef, useValue: new MockElementRef() }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapEditorComponent);
    component = fixture.componentInstance;
    fakeElem = TestBed.inject(ElementRef);
    component.objects = [
      {
        name: "object",
        id: "testObject",
        model: 331,
        posX: -1856.76001,
        posY: 15.491,
        posZ: 1061.24304,
        rotX: 0.0,
        rotY: 0.0,
        rotZ: 90.0,
        dimension: 0,
        interior: 14,
      },
      {
        name: "vehicle",
        id: "testVehicle",
        model: 331,
        posX: -1856.76001,
        posY: 15.491,
        posZ: 1061.24304,
        rotX: 0.0,
        rotY: 0.0,
        rotZ: 90.0,
        dimension: 0,
        interior: 14,
      },
    ];
    fixture.detectChanges();
  });

  it("should create", () => {
    spyOn(component, "mapView").and.callFake(() => {});
    fixture.whenStable();
    expect(component).toBeTruthy();
    expect(component.objects).toBeTruthy();
    expect(component.canvas).toBeTruthy();
  });
  it("should filter material and text objects", () => {
    fixture.whenStable();
    const objects = [
      { name: "object" },
      { name: "vehicle " },
      { name: "text" },
      { name: "material" },
    ];
    expect(component.filter(objects)).toEqual([
      { name: "object" },
      { name: "vehicle " },
    ]);
  });

  it("should return next easeIn animation frame data", () => {
    expect(component.easeIn(10, 0, 100, 10, 1)).toBe(100);
  });
  it("should return first easeIn animation frame data", () => {
    expect(component.easeIn(0, 0, 100, 10, 1)).toBe(0);
  });
  it("should set another objects", () => {
    spyOn(component, "filter").and.callThrough();
    spyOn(component, "viewportTo").and.callFake(() => {});
    const propSpy = spyOnProperty(component, "objects", "set");
    component.objects = [
      { name: "object" },
      { name: "vehicle " },
      { name: "text" },
      { name: "material" },
    ];
    expect(propSpy).toHaveBeenCalled();
  });
});
