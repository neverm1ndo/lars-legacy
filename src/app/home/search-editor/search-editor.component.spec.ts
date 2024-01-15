import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { SearchEditorComponent } from "./search-editor.component";

describe("SearchEditorComponent", () => {
  let component: SearchEditorComponent;
  let fixture: ComponentFixture<SearchEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchEditorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit("should create", () => {
    expect(component).toBeTruthy();
  });
});
