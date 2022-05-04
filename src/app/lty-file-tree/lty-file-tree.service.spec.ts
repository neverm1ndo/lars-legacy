import { TestBed } from '@angular/core/testing';

import { LtyFileTreeService } from './lty-file-tree.service';

describe('LtyFileTreeServiceService', () => {
  let service: LtyFileTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LtyFileTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
