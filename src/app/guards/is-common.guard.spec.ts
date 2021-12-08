import { TestBed } from '@angular/core/testing';

import { IsCommonGuard } from './is-common.guard';

describe('IsCommonGuard', () => {
  let guard: IsCommonGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsCommonGuard);
  });

  xit('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
