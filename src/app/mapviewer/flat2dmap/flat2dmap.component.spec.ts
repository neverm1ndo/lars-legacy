import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Flat2dmapComponent } from './flat2dmap.component';

describe('Flat2dmapComponent', () => {
  let component: Flat2dmapComponent;
  let fixture: ComponentFixture<Flat2dmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Flat2dmapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Flat2dmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
