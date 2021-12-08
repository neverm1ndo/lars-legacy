import { TestBed } from '@angular/core/testing';

import { IsConfiguratorGuard } from './is-configurator.guard';

describe('IsConfiguratorGuard', () => {
  let guard: IsConfiguratorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsConfiguratorGuard);
  });

  xit('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
