import { TestBed } from "@angular/core/testing";

import { ConfiguratorGuard } from "./is-configurator.guard";

describe("ConfiguratorGuard", () => {
  let guard: ConfiguratorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ConfiguratorGuard);
  });

  xit("should be created", () => {
    expect(guard).toBeTruthy();
  });
});
