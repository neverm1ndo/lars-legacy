import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileTreeItemsComponent } from './file-tree-items.component';

describe('FileTreeItemsComponent', () => {
  let component: FileTreeItemsComponent;
  let fixture: ComponentFixture<FileTreeItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileTreeItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileTreeItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
