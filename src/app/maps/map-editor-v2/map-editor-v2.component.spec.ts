import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MapEditorV2Component } from "./map-editor-v2.component";

describe("MapEditorV2Component", () => {
  let component: MapEditorV2Component;
  let fixture: ComponentFixture<MapEditorV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapEditorV2Component],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapEditorV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
