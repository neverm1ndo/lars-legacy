import { TestBed } from "@angular/core/testing";

import { NotChangedDocumentGuard } from "./not-changed-document.guard";

describe("NotChangedDocumentGuard", () => {
  let guard: NotChangedDocumentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NotChangedDocumentGuard);
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });
});
