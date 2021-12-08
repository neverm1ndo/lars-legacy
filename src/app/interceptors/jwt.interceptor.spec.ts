import { TestBed } from '@angular/core/testing';

import { JWTInterceptor } from './jwt.interceptor';

describe('AuthInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      JWTInterceptor
      ]
  }));

  xit('should be created', () => {
    const interceptor: JWTInterceptor = TestBed.inject(JWTInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
