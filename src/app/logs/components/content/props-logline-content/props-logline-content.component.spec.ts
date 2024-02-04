import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropsLoglineContentComponent } from './props-logline-content.component';

describe('PropsLoglineContentComponent', () => {
  let component: PropsLoglineContentComponent;
  let fixture: ComponentFixture<PropsLoglineContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropsLoglineContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropsLoglineContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
