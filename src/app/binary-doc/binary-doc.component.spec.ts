import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinaryDocComponent } from './binary-doc.component';

describe('BinaryDocComponent', () => {
  let component: BinaryDocComponent;
  let fixture: ComponentFixture<BinaryDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BinaryDocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BinaryDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
