import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { ApiService } from "./api.service";
import { UserService } from "../user/domain/infrastructure/user.service";

import { of } from "rxjs";

xdescribe("ApiService", () => {
  let service: ApiService;
  let httpMock: any;
  let localStore: any;
  let fakeUser = {
    settings: {
      tray: false,
      lineChunk: 100,
      listStyle: "small",
      textEditorStyle: "material",
    },
    getUserSettings: jasmine.createSpy("getUserSettings"),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService, { provide: UserService, useValue: fakeUser }],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.get(HttpTestingController);
    fakeUser.getUserSettings.and.returnValue(fakeUser.settings);
    localStore = {
      last: '{ "search": ["John Doe", "Mary", "Alice", "ip:127.0.0.1"], "files": [{ "path": "/conf/conf.cfg", "name": "conf.cfg" }]}',
    };
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should return chunk size string from users settings", () => {
    expect(service.getChunkSize()).toBe("100");
  });

  it("should return list of admins", (done) => {
    service.getAdminsList().subscribe((list) => {
      expect(list).toEqual([]);
      done();
    });
    let req = httpMock.expectOne(service.URL.ADMINS.LIST);
    req.flush([]);
    httpMock.verify();
  });

  it("should set admin group", (done) => {
    service.setAdminGroup(123, 10).subscribe((res) => {
      expect(res).toEqual(200);
      done();
    });
    let req = httpMock.expectOne(service.URL.ADMINS.CHANGE_MAIN_GROUP);
    req.flush(200);
    httpMock.verify();
  });

  it("should return config files directory tree", (done) => {
    service.getConfigsDir().subscribe((res) => {
      expect(res).toEqual([]);
      done();
    });
    let req = httpMock.expectOne(service.URL.CONFIGS.FILE_TREE);
    req.flush([]);
    httpMock.verify();
  });

  it("should return map files directory tree", (done) => {
    service.getMapsDir().subscribe((res) => {
      expect(res).toEqual([]);
      done();
    });
    let req = httpMock.expectOne(service.URL.MAPS.FILE_TREE);
    req.flush([]);
    httpMock.verify();
  });

  it("should return config text", (done) => {
    service.getConfigText("/config.cfg").subscribe((res) => {
      expect(res).toBe("state = clean");
      done();
    });
    let req = httpMock.expectOne(
      service.URL.CONFIGS.CONFIG_FILE + "?path=/config.cfg",
    );
    req.flush("state = clean");
    httpMock.verify();
  });

  it("should return map text/plane", (done) => {
    service.getMap("/map.map.off").subscribe((res) => {
      expect(res).toBe("<map></map>");
      done();
    });
    let req = httpMock.expectOne(
      service.URL.MAPS.MAP_FILE + "?path=/map.map.off",
    );
    req.flush("<map></map>");
    httpMock.verify();
  });

  it("should delete map and recive 200 OK", (done) => {
    service.deleteMap("/map.map.off").subscribe((res) => {
      expect(res).toBe(200);
      done();
    });
    let req = httpMock.expectOne(
      service.URL.UTILS.DELETE_FILE + "?path=/map.map.off",
    );
    req.flush(200);
    httpMock.verify();
  });

  it("should return last log lines", (done) => {
    service.getLast().subscribe((res) => {
      expect(res).toEqual([]);
      done();
    });
    let req = httpMock.expectOne(service.URL.LOGS.LAST + "?page=0&lim=100");
    req.flush([]);
    httpMock.verify();
  });
  it("should return file info", (done) => {
    service.getFileInfo("/conf.cfg").subscribe((res) => {
      expect(res).toEqual({});
      done();
    });
    let req = httpMock.expectOne(
      service.URL.CONFIGS.FILE_STATS + "?path=/conf.cfg",
    );
    req.flush({});
    httpMock.verify();
  });

  it("should upload map file to the server", (done) => {
    const form = new FormData();
    const blob = new Blob([]);
    service.uploadFileMap(form).subscribe((res) => {
      expect(true).toBeTruthy();
      done();
    });
    let req = httpMock.expectOne(service.URL.MAPS.UPLOAD);
    req.flush(blob);
    httpMock.verify();
  });
  it("should upload config file to the server", (done) => {
    const form = new FormData();
    const blob = new Blob([]);
    service.uploadFileCfg(form).subscribe((res) => {
      expect(true).toBeTruthy();
      done();
    });
    let req = httpMock.expectOne(service.URL.CONFIGS.SAVE_FILE);
    req.flush(blob);
    httpMock.verify();
  });
});
