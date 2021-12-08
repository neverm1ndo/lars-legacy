import { TestBed } from '@angular/core/testing';

import { IsDevGuard } from './is-dev.guard';

describe('IsDevGuard', () => {
  let guard: IsDevGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsDevGuard);
  });

  xit('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
