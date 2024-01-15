import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { EmptyDocComponent } from "./empty-doc.component";

describe("EmptyDocComponent", () => {
  let component: EmptyDocComponent;
  let fixture: ComponentFixture<EmptyDocComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmptyDocComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
