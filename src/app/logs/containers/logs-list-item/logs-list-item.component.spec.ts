import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LogsListItemComponent } from "./logs-list-item.component";

describe("LogsListItemComponent", () => {
  let component: LogsListItemComponent;
  let fixture: ComponentFixture<LogsListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogsListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
