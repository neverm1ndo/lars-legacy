import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyDocComponent } from './empty-doc.component';

describe('EmptyDocComponent', () => {
  let component: EmptyDocComponent;
  let fixture: ComponentFixture<EmptyDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptyDocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
