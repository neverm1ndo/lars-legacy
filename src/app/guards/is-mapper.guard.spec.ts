import { TestBed } from '@angular/core/testing';

import { MapperGuard } from './is-mapper.guard';

describe('MapperGuard', () => {
  let guard: MapperGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MapperGuard);
  });

  xit('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
