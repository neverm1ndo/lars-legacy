import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoglineContentComponent } from './logline-content.component';

describe('LoglineContentComponent', () => {
  let component: LoglineContentComponent;
  let fixture: ComponentFixture<LoglineContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoglineContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoglineContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
