import { TestBed } from '@angular/core/testing';

import { WebSocketService } from './web-socket.service';

describe('WebSocketService', () => {
  let service: WebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
