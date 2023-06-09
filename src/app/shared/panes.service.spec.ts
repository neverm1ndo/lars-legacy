import { TestBed } from '@angular/core/testing';

import { PanesService } from './panes.service';

describe('PanesService', () => {
  let service: PanesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
