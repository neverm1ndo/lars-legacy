import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleLineProcessComponent } from './simple-line-process.component';

describe('SimpleLineProcessComponent', () => {
  let component: SimpleLineProcessComponent;
  let fixture: ComponentFixture<SimpleLineProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleLineProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleLineProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
