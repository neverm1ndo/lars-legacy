import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeathLoglineContentComponent } from './death-logline-content.component';

describe('DeathLoglineContentComponent', () => {
  let component: DeathLoglineContentComponent;
  let fixture: ComponentFixture<DeathLoglineContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeathLoglineContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeathLoglineContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
