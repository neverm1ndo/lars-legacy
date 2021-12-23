import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupItemComponent } from './backup-item.component';

describe('BackupItemComponent', () => {
  let component: BackupItemComponent;
  let fixture: ComponentFixture<BackupItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackupItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackupItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
