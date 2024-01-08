import { TestBed } from '@angular/core/testing';

import { BackuperGuard } from './is-backuper.guard';

describe('BackuperGuard', () => {
  let guard: BackuperGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BackuperGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
