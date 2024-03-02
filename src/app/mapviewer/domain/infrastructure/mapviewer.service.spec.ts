import { TestBed } from '@angular/core/testing';

import { MapviewerService } from './mapviewer.service';

describe('MapviewerService', () => {
  let service: MapviewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapviewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
