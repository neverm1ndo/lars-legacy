import { TestBed } from '@angular/core/testing';

import { IsBackuperGuard } from './is-backuper.guard';

describe('IsBackuperGuard', () => {
  let guard: IsBackuperGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsBackuperGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
