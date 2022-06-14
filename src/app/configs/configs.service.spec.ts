import { TestBed } from '@angular/core/testing';

import { ConfigsService } from './configs.service';

describe('ConfigsService', () => {
  let service: ConfigsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
