import { TestBed } from '@angular/core/testing';

import { CommonGuard } from './is-common.guard';

describe('CommonGuard', () => {
  let guard: CommonGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CommonGuard);
  });

  xit('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
