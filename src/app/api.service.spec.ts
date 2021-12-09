import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule , HttpTestingController} from '@angular/common/http/testing'

import { ApiService } from './api.service';
import { UserService } from './user.service';

import { of } from 'rxjs';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: any;
  let localStore: any;
  let fakeUser =  {
      settings: { "tray": false, "lineChunk": 100, "listStyle": "small", "textEditorStyle": "material" },
      getUserSettings: jasmine.createSpy('getUserSettings'),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        { provide: UserService, useValue: fakeUser }
      ]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.get(HttpTestingController);
    fakeUser.getUserSettings.and.returnValue(fakeUser.settings)
    localStore = {
      last: '{ "search": ["John Doe", "Mary", "Alice", "ip:127.0.0.1"], "files": [{ "path": "/conf/conf.cfg", "name": "conf.cfg" }]}'
    };
  });
  /**
  * {"search":["punk","srl:0*EFDD080DED4549D0A59F0ED9EC854CE48588D894","srl:12389*8C8C900CEF0C5EFD8C08ACE4F4D989E994E085A9","awkng.Awakener","ip:176.193.65.97","srl:12345*8C5EE8AAFD459854D8F9DDCC5A4E8C","srl:12389*A44FD59EDD4409A0995D48449FD09D0AED8E95DC"],"upload":[],"files":[{"path":"/home/svr_sa/freemode/mta10/bugs.map","name":"bugs.map"},{"path":"/home/svr_sa/start.sh","name":"start.sh"},{"path":"/home/svr_sa/server.cfg","name":"server.cfg"},{"path":"/home/svr_sa/mysql_log.txt","name":"mysql_log.txt"},{"path":"/home/svr_sa/nohup.out","name":"nohup.out"},{"path":"/home/svr_sa/server_log.txt","name":"server_log.txt"},{"path":"/home/svr_sa/lookatme.txt","name":"lookatme.txt"}]}
  **/
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return chunk size string from users settings', () => {
    expect(service.getChunkSize()).toBe('100');
  })

  it('should return list of admins', (done) => {
    service.getAdminsList().subscribe((list) => {
      expect(list).toEqual([]);
      done();
    })
    let req = httpMock.expectOne(service.URL_ADMINS_LIST);
    req.flush([]);
    httpMock.verify();
  })

  it('should return list of all admins', (done) => {
    service.getAdminsAll().subscribe((list) => {
      expect(list).toEqual([]);
      done();
    })
    let req = httpMock.expectOne(service.URL_ADMINS_LIST);
    req.flush([]);
    httpMock.verify();
  })

  it('should set admin group', (done) => {
    service.setAdminGroup('John', 10).subscribe((res) => {
      expect(res).toEqual(200);
      done();
    })
    let req = httpMock.expectOne(service.URL_ADMIN_CHANGE_GROUP);
    req.flush(200);
    httpMock.verify();
  })

  it('should close some admin session', (done) => {
    service.closeAdminSession('John').subscribe((res) => {
      expect(res).toEqual(200);
      done();
    })
    let req = httpMock.expectOne(service.URL_ADMIN_TOKEN_EXPIRATION + '?username=John');
    req.flush(200);
    httpMock.verify();
  })

  it('should return list of sub groups', (done) => {
    service.getAdminSubGroup().subscribe((res) => {
      expect(res).toEqual([]);
      done();
    })
    let req = httpMock.expectOne(service.URL_ADMIN_SUB_GROUP);
    req.flush([]);
    httpMock.verify();
  })

  it('should return config files directory tree', (done) => {
    service.getConfigsDir().subscribe((res) => {
      expect(res).toEqual([]);
      done();
    })
    let req = httpMock.expectOne(service.URL_CONFIGS);
    req.flush([]);
    httpMock.verify();
  })

  it('should return map files directory tree', (done) => {
    service.getMapsDir().subscribe((res) => {
      expect(res).toEqual([]);
      done();
    })
    let req = httpMock.expectOne(service.URL_MAPS);
    req.flush([]);
    httpMock.verify();
  })

  it('should return config text', (done) => {
    service.getConfigText('/config.cfg').subscribe((res) => {
      expect(res).toBe('state = clean');
      done();
    })
    let req = httpMock.expectOne(service.URL_CONFIG + '?path=/config.cfg');
    req.flush('state = clean');
    httpMock.verify();
  })

  it('should return map text/plane', (done) => {
    service.getMap('/map.map.off').subscribe((res) => {
      expect(res).toBe('<map></map>');
      done();
    })
    let req = httpMock.expectOne(service.URL_MAPINFO + '?path=/map.map.off');
    req.flush('<map></map>');
    httpMock.verify();
  })

  it('should delete map and recive 200 OK', (done) => {
    service.deleteMap('/map.map.off').subscribe((res) => {
      expect(res).toBe(200);
      done();
    })
    let req = httpMock.expectOne(service.URL_DELETE_FILE + '?path=/map.map.off');
    req.flush(200);
    httpMock.verify();
  })

  it('should return last log lines', (done) => {
    service.getLast().subscribe((res) => {
      expect(res).toEqual([]);
      done();
    })
    let req = httpMock.expectOne(service.URL_LAST + '?page=0&lim=100');
    req.flush([]);
    httpMock.verify();
  })
  it('should return file info', (done) => {
    service.getFileInfo('/conf.cfg').subscribe((res) => {
      expect(res).toEqual({});
      done();
    })
    let req = httpMock.expectOne(service.URL_FILE_INFO + '?path=/conf.cfg');
    req.flush({});
    httpMock.verify();
  })

  it('should save file to the server', (done) => {
    service.saveFile('/conf.cfg', 'view = 100').subscribe((res) => {
      expect(res).toEqual(200);
      done();
    })
    let req = httpMock.expectOne(service.URL_SAVE_CONFIG);
    req.flush(200);
    httpMock.verify();
  })

  it('should upload map file to the server', (done) => {
    const form = new FormData();
    const blob = new Blob([])
    service.uploadFileMap(form).subscribe((res) => {
      expect(true).toBeTruthy();
      done();
    })
    let req = httpMock.expectOne(service.URL_UPLOAD_MAP);
    req.flush(blob);
    httpMock.verify();
  })
  it('should upload config file to the server', (done) => {
    const form = new FormData();
    const blob = new Blob([])
    service.uploadFileCfg(form).subscribe((res) => {
      expect(true).toBeTruthy();
      done();
    })
    let req = httpMock.expectOne(service.URL_UPLOAD_CFG);
    req.flush(blob)
    httpMock.verify();
  })

  it('should update page with lazy loading', () => {
    spyOn(service, 'refresh').and.callFake(() => {})
    service.lazyUpdate(2);
    expect(service.currentPage).toBe(2);
    expect(service.refresh).toHaveBeenCalledTimes(1);
  })

  it('should return log file with the last lines', (done) => {
    spyOn(service, 'search').and.returnValue(of([{ process: '<start/pre-start>' }]))
    spyOn(service, 'getLast').and.returnValue(of([{ process: '<end/end>' }]))
    service.getLogFile().subscribe((res) => {
      expect(res).toEqual([{ process: '<end/end>' }]);
      done();
    })
  })
  it('should return log file with the last lines', (done) => {
    spyOn(service, 'search').and.returnValue(of([{ process: '<start/pre-start>' }]))
    spyOn(service, 'getLast').and.returnValue(of([{ process: '<end/end>' }]))
    spyOnProperty(service, 'queryType').and.returnValue('search');
    service.getLogFile().subscribe((res) => {
      expect(res).toEqual([{ process: '<start/pre-start>' }]);
      expect(service.lastQuery.lim).toBe('100');
      done();
    })
  })

  it('should add last search query to history in localStorage if not alredy there', () => {
    spyOn(window.localStorage, 'getItem').and.callFake((key: string) =>
      key in localStore?localStore[key]:null
    );
    spyOn(window.localStorage, 'setItem').and.callFake(
      (key, value) => (localStore[key] = value + '')
    );
    spyOn(service, 'noteIsAlreadyExists').and.returnValue(false);

    service.addToRecent('search', 'Joe');
    expect(JSON.parse(localStore.last).search.includes('Joe')).toBeTruthy();

  })
  it('should skip adding last search query to history in localStorage if not alredy there', () => {
    spyOn(window.localStorage, 'getItem').and.callFake((key: string) =>
      key in localStore?localStore[key]:null
    );
    spyOn(window.localStorage, 'setItem').and.callFake(
      (key, value) => (localStore[key] = value + '')
    );
    spyOn(service, 'noteIsAlreadyExists').and.returnValue(true);

    service.addToRecent('search', 'Joe');
    expect(JSON.parse(localStore.last).search.includes('Joe')).toBeFalsy();
  })

  it ('should return true if search history note is alredy exists in localStorage', () => {
    expect(service.noteIsAlreadyExists(JSON.parse(localStore.last), 'search', 'Alice')).toBeTruthy();
  })
  it ('should return false if search history note is alredy exists in localStorage', () => {
    expect(service.noteIsAlreadyExists(JSON.parse(localStore.last), 'search', 'Alex')).toBeFalsy();
  })
  it ('should return false if file history note is not exists in localStorage', () => {
    expect(service.noteIsAlreadyExists(JSON.parse(localStore.last), 'files', { path: '/conf/conf.ini', name: 'conf.ini'})).toBeFalsy();
  })
  it ('should return true if file history note is alredy exists in localStorage', () => {
    expect(service.noteIsAlreadyExists(JSON.parse(localStore.last), 'files', { path: '/conf/conf.cfg', name: 'conf.cfg'})).toBeTruthy();
  })
});
