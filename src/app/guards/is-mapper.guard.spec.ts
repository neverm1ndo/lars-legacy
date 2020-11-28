import { TestBed } from '@angular/core/testing';

import { IsMapperGuard } from './is-mapper.guard';

describe('IsMapperGuard', () => {
  let guard: IsMapperGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsMapperGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
