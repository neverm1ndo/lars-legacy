import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SimpleLineProcessComponent } from './simple-line-process.component';

describe('SimpleLineProcessComponent', () => {
  let component: SimpleLineProcessComponent;
  let fixture: ComponentFixture<SimpleLineProcessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleLineProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleLineProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
