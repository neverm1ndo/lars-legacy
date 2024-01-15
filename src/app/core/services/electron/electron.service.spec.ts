import { TestBed } from "@angular/core/testing";

import { ElectronService } from "./electron.service";

describe("ElectronService", () => {
  let service: ElectronService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElectronService],
    });
    service = TestBed.inject(ElectronService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
  it("should define all necessary electron deps", () => {
    expect(service.ipcRenderer).toBeTruthy();
    expect(service.webFrame).toBeTruthy();
    expect(service.shell).toBeTruthy();
    expect(service.childProcess).toBeTruthy();
    expect(service.fs).toBeTruthy();
  });
  it("should return false if running out of Electron", () => {
    spyOnProperty(service, "isElectron").and.returnValue(false);
    expect(service.isElectron).toEqual(false);
  });
});
