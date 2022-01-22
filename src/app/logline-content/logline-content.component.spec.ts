import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoglineContentComponent } from './logline-content.component';

describe('LoglineContentComponent', () => {
  let component: LoglineContentComponent;
  let fixture: ComponentFixture<LoglineContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoglineContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoglineContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
