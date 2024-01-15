import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { TopperComponent } from "./topper.component";
import { UserService } from "../user/user.service";

describe("TopperComponent", () => {
  let component: TopperComponent;
  let fixture: ComponentFixture<TopperComponent>;
  let fakeUserService;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TopperComponent],
      providers: [UserService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit("should create", () => {
    expect(component).toBeTruthy();
  });
  xit("opens forum", () => {
    expect(true).toBeTruthy();
  });
});
