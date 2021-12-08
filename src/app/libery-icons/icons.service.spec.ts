import { TestBed } from '@angular/core/testing';

import { IconsService } from './icons.service';

describe('IconsService', () => {
  let service: IconsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IconsService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
