import { TestBed } from "@angular/core/testing";

import { DevGuard } from "./is-dev.guard";

describe("DevGuard", () => {
  let guard: DevGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DevGuard);
  });

  xit("should be created", () => {
    expect(guard).toBeTruthy();
  });
});
