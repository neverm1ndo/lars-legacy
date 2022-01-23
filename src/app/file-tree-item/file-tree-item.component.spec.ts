import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FileTreeItemComponent } from './file-tree-item.component';

describe('FileTreeItemComponent', () => {
  let component: FileTreeItemComponent;
  let fixture: ComponentFixture<FileTreeItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FileTreeItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTreeItemComponent);
    component = fixture.componentInstance;
    component.item = { name: 'mappy.map', path: '/maps/mappy.map', type: 'file' }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should return true if name includes map file extension', () => {
    expect(component.isMapFile('mappy.map')).toBeTruthy();
  });
  it('should return true if name includes config file extension', () => {
    expect(component.isConfFile('c.conf')).toBeTruthy();
  });
  it('should return true if name includes shell file extension', () => {
    expect(component.isShFile('any.sh')).toBeTruthy();
  });
  it('should return true if name includes database binary file extension', () => {
    expect(component.isDBFile('hig.db')).toBeTruthy();
  });
});
