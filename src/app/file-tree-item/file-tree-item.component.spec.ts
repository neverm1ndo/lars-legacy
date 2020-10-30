import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTreeItemComponent } from './file-tree-item.component';

describe('FileTreeItemComponent', () => {
  let component: FileTreeItemComponent;
  let fixture: ComponentFixture<FileTreeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileTreeItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTreeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
