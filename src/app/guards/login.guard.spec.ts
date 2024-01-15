import { TestBed } from "@angular/core/testing";

import { LoginGuard } from "./login.guard";

describe("LoginGuard", () => {
  let guard: LoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoginGuard);
  });

  xit("should be created", () => {
    expect(guard).toBeTruthy();
  });
});
