import { TestBed } from '@angular/core/testing';

import { DdService } from './dd.service';

describe('DdService', () => {
  let service: DdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
