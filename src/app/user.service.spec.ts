import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import { Router } from '@angular/router';

import { UserService } from './user.service';
import { ElectronService } from './core/services/electron/electron.service';
import { Workgroup } from './enums/workgroup.enum';

describe('UserService', () => {
  let service: UserService;
  let localStore: any;
  let electron: ElectronService;
  let idb: NgxIndexedDBService;
  let httpMock: HttpTestingController;

  let router = {
    navigate: jasmine.createSpy('navigate')
  }

  const dbConfig: DBConfig  = {
    name: 'LibertyUsers',
    version: 1,
    objectStoresMeta: [{
      store: 'user',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'avatar', keypath: 'avatar', options: { unique: false } },
        { name: 'id', keypath: 'id', options: { unique: true } },
        { name: 'group', keypath: 'group', options: { unique: false } },
      ]
    }]
  };
  const fakeUserData = {
    name: 'John',
    id: 0,
    gr: 10,
    role: '0',
    token: 'sdfsdfsdf',
    avatar: 'url://avatar'
  };
  const fakeSettings = '{ "tray": false, "lineChunk": 100, "listStyle": "small", "textEditorStyle": "material" }';
  const dialogOpts = {
      type: 'question',
      buttons: ['Yes', 'Cancel'],
      title: 'Test title',
      message: 'Test message'
    }
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxIndexedDBModule.forRoot(dbConfig),
      ],
      providers: [
        UserService,
        { provide: Router, useValue: router }
      ]
    });
    service = TestBed.inject(UserService);
    electron = TestBed.inject(ElectronService);
    idb = TestBed.inject(NgxIndexedDBService);
    httpMock = TestBed.get(HttpTestingController);

    localStore = {
      'user': '{"name":"Neverm1ndo","role":0,"id":123,"gr":10,"avatar":"https://www.gta-liberty.ru/images/avatars/upload/123_1603027719.png","token":"sdfsdfskdfjsokdj_fake"}'
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should return user settings if localStorage includes settings', () => {
    spyOn(window.localStorage, 'getItem').and.callFake((key: string) => fakeSettings);
    spyOn(window.localStorage, 'setItem').and.callFake(
      (key, value) => (localStore[key] = value + '')
    );
    expect(service.getUserSettings()).toEqual(JSON.parse(fakeSettings))
  });

  it('should set user settings to default if localStorage not includes settings', () => {
    spyOn(window.localStorage, 'setItem').and.callFake(
      (key, value) => (localStore[key] = value + '')
    );
    expect(service.getUserSettings()).toEqual(JSON.parse(fakeSettings));
  });

  it('should return admin role', () => {
    expect(service.getUserGroupName(Workgroup.Dev)).toBe('Разработчик');
    expect(service.getUserGroupName(Workgroup.Challenger)).toBe('Претендент');
    expect(service.getUserGroupName(Workgroup.Admin)).toBe('Админ');
    expect(service.getUserGroupName(Workgroup.Mapper)).toBe('Маппер');
    expect(service.getUserGroupName(Workgroup.CFR)).toBe('Редактор конфигурационных файлов');
    expect(service.getUserGroupName(Workgroup.Backuper)).toBe('Бэкапер');
    expect(service.getUserGroupName(4)).toBe('Игрок');
    expect(service.getUserGroupName(2)).toBe('Игрок');
  });

  it('should return user info if localStorage includes user', () => {
    spyOn(window.localStorage, 'getItem').and.callFake((key: string) =>
      key in localStore?localStore[key]:null
    );
    expect(service.getUserInfo()).toEqual(JSON.parse(localStore['user']));
  });

  it('should return null if localStorage not includes user', () => {
    spyOn(window.localStorage, 'getItem').and.callFake((key: string) => null);
    expect(service.getUserInfo()).toBe(null);
  });

  it('should return an authentication confirmation if a token is present', () => {
    spyOn(service, 'getUserInfo').and.callFake(() => JSON.parse(localStore['user']));
    expect(service.isAuthenticated()).toBeTruthy();
  });

  it('should return an authentication rejection if a token is not present', () => {
    spyOn(service, 'getUserInfo').and.callFake(() => null);
    expect(service.isAuthenticated()).toBeFalsy();
  });

  it('should navigate to login screen after logout', (done) => {
    spyOn(electron.dialog, 'showMessageBox').and.returnValue(Promise.resolve({ response: 0, checkboxChecked: false }));
    return service.logOut().then(() => {
      expect(true).toBeTruthy();
      done();
    })
  });
  it('should cancel navigation to the login screen if user rejected logout', (done) => {
    spyOn(electron.dialog, 'showMessageBox').and.returnValue(Promise.resolve({ response: 1, checkboxChecked: false }));
    return service.logOut().catch((err) => {
      expect(err).toBe('REJECTED BY USER');
      done();
    })
  });

  it('should return and save user data in localStorage after login', (done) => {
    service.loginUser({ email: 'test@nmnd.ru', password: '1111'})
    .subscribe((user) => {
      expect(user).toEqual(fakeUserData);
      done();
    });
    const logInRequest = httpMock.expectOne(service.URL_LOGIN);
    logInRequest.flush(fakeUserData);
    httpMock.verify();
  });

  it('should return an error after bad login request', (done) => {
    const err = new ErrorEvent('UNAUTHORIZED');
    service.loginUser({ email: 'test@nmnd.ru', password: '1111'})
    .subscribe((user) => {
    }, (error) => {
      console.log(error)
      expect(error.error).toEqual(err);
      done();
    });
    const logInRequest = httpMock.expectOne(service.URL_LOGIN);
    logInRequest.error(err);
    httpMock.verify();
  });

});
