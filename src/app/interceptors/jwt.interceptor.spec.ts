import { TestBed } from '@angular/core/testing';

import { JWTInterceptor } from './jwt.interceptor';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ApiService } from '../api.service';
import { UserService } from '../user.service';

describe('JWTInterceptor', () => {

  let httpMock: HttpTestingController;
  let service: any;
  let userSpy: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const user = jasmine.createSpyObj('UserService', ['getUserInfo', 'isAuthenticated']);

    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        ApiService,
        JWTInterceptor,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JWTInterceptor,
            multi: true
        },
          {
            provide: UserService,
            useValue: user
          }
      ]
    })

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ApiService);
    userSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should be created', () => {
    const interceptor: JWTInterceptor = TestBed.inject(JWTInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should add an Authorization header', () => {
    const fakeToken = 'asdvsfbqervwsf_fake-token.xkcvnmlk';
    userSpy.getUserInfo.and.returnValue({ name: 'John', token: fakeToken })
    userSpy.isAuthenticated.and.returnValue(true);
    service.getAdminsAll().subscribe(res => {
      expect(res).toBeTruthy();
    });
    const req = httpMock.expectOne(service.URL_ADMINS_LIST);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${fakeToken}`);
  });
});
