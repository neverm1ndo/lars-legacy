import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DevServerControlsComponent } from "./dev-server-controls.component";

describe("DevServerControlsComponent", () => {
  let component: DevServerControlsComponent;
  let fixture: ComponentFixture<DevServerControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DevServerControlsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DevServerControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
