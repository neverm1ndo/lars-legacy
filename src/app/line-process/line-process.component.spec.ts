import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineProcessComponent } from './line-process.component';

describe('LineProcessComponent', () => {
  let component: LineProcessComponent;
  let fixture: ComponentFixture<LineProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
